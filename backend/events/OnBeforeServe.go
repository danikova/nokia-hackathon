package events

import (
	"errors"
	"hackathon-backend/types"
	"hackathon-backend/utils"
	"log"
	"net/http"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/adrg/strutil"
	"github.com/adrg/strutil/metrics"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/cron"

	_ "fmt"
)

var runResultsCollectionName = "run_results"

func OnBeforeServe(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		initCronJobs(app)

		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		addGithubBotStarted(app, e)
		addGithubBotFinished(app, e)
		addGetRunResultsSum(app, e)

		return nil
	})
}

func initCronJobs(app *pocketbase.PocketBase) {
	scheduler := cron.New()

	workspaceEventsCleanup := func() {
		records, _ := app.Dao().FindRecordsByExpr(WorkspaceEventsCollectionName,
			dbx.NewExp("new_run_started  <> '' AND new_run_started IS NOT NULL"),
		)

		now := time.Now()
		for _, workspace_event := range records {
			new_run_started := workspace_event.GetDateTime("new_run_started")
			if now.Sub(new_run_started.Time()).Minutes() > 5 {
				workspace_event.Set("new_run_started", nil)
				app.Dao().SaveRecord(workspace_event)
			}
		}
	}
	workspaceEventsCleanup()

	scheduler.MustAdd("workspaceEventsCleanup", "*/5 * * * *", workspaceEventsCleanup)

	scheduler.Start()
}

func GetWorkspaceByMeta(app *pocketbase.PocketBase, m *types.GithubMetaType) (*models.Record, error) {
	repo_url := "https://github.com/" + m.Repository

	workspace, err := app.Dao().FindFirstRecordByData(WorkspacesCollectionName, "repo_url", repo_url)
	if workspace == nil {
		return nil, errors.New("This repository (" + m.Repository + ") is not connected with any workspace")
	}
	if err != nil {
		return nil, err
	}

	return workspace, nil
}

func GetWorkspaceEventByWorkspace(app *pocketbase.PocketBase, workspace *models.Record) (*models.Record, error) {
	workspace_event, err := app.Dao().FindFirstRecordByData(WorkspaceEventsCollectionName, "workspace", workspace.Id)
	if workspace_event == nil {
		return nil, errors.New("Workspace event not found, with workspace id" + workspace.Id)
	}
	if err != nil {
		return nil, err
	}

	return workspace_event, nil
}

type RunResult struct {
	ID               string  `db:"id" json:"id"`
	CollectionID     string  `db:"collectionId" json:"collectionId"`
	CollectionName   string  `db:"collectionName" json:"collectionName"`
	Created          string  `db:"created" json:"created"`
	Updated          string  `db:"updated" json:"updated"`
	Workspace        string  `db:"workspace" json:"workspace"`
	RunID            string  `db:"run_id" json:"run_id"`
	Task             string  `db:"task" json:"task"`
	ExecutionTime    float64 `db:"execution_time" json:"execution_time"`
	OutputSimilarity float64 `db:"output_similarity" json:"output_similarity"`
	Status           string  `db:"status" json:"status"`
	Output           string  `db:"output" json:"output"`
	Stderr           string  `db:"stderr" json:"stderr"`
	ReturnCode       int     `db:"returncode" json:"returncode"`
	IsSuccess        bool    `db:"is_success" json:"is_success"`
}

var queryCleaner = regexp.MustCompile(`\s+`)
var queryStr = `
WITH RankedResults AS (
	SELECT
			t1.*,
			ws.repo_url,
			ROW_NUMBER() OVER (PARTITION BY t1.task
												 ORDER BY t1.output_similarity DESC, t1.execution_time ASC) AS row_num
	FROM run_results t1
	INNER JOIN workspaces ws ON t1.workspace = ws.id
	WHERE ws.id = {:workspaceId}
)
SELECT *
FROM RankedResults
WHERE row_num = 1
`
var cleanQueryStr = strings.TrimSpace(queryCleaner.ReplaceAllString(queryStr, " "))

func addGetRunResultsSum(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/run_result_sum/",
		Handler: func(c echo.Context) error {
			info := apis.RequestData(c)
			workspaceId := strings.TrimSpace(c.QueryParam("workspaceId"))

			if workspaceId == "" {
				return echo.NewHTTPError(http.StatusBadRequest, "workspaceId is required")
			}

			expressions := []dbx.Expression{
				dbx.HashExp{"id": workspaceId},
			}
			if info.AuthRecord.Get("role") != "staff" {
				expressions = append(expressions, dbx.HashExp{UserFieldKey: info.AuthRecord.Id})
			}

			workspaces, err := app.Dao().FindRecordsByExpr(WorkspacesCollectionName,
				dbx.And(expressions[:]...),
			)

			if err != nil || len(workspaces) == 0 {
				return echo.NewHTTPError(http.StatusBadRequest, "No workspace found")
			}

			if workspaceId == "" || info.AuthRecord.Get("role") != "staff" {
				workspaceId = workspaces[0].Id
			}

			results := []RunResult{}
			err = app.Dao().DB().
				NewQuery(cleanQueryStr).
				Bind(dbx.Params{
					"workspaceId": workspaceId,
				}).
				All(&results)

			if err != nil || len(results) == 0 {
				log.Panic(err)
				return echo.NewHTTPError(http.StatusBadRequest, "Wrong query")
			}

			return c.JSON(http.StatusCreated, results)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			apis.RequireRecordAuth(),
		},
	})
}

func addGithubBotStarted(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/github-bot-started/",
		Handler: func(c echo.Context) error {
			var reqBody types.GithubRequestBody
			var err error

			if err = c.Bind(&reqBody); err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			workspace, err := GetWorkspaceByMeta(app, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			workspace_event, err := GetWorkspaceEventByWorkspace(app, workspace)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			now := time.Now()

			workspace_event.Set("new_run_started", now)

			if err := app.Dao().SaveRecord(workspace_event); err != nil {
				return err
			}

			resBody := &types.GithubResponseBody{
				Code:    201,
				Message: "workflow event registered",
			}

			return c.JSON(http.StatusCreated, resBody)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			apis.RequireGuestOnly(),
		},
	})
}

type recordData struct {
	Action string         `json:"action"`
	Record *models.Record `json:"record"`
}

func addGithubBotFinished(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/github-bot-finished/",
		Handler: func(c echo.Context) error {
			var reqBody types.GithubRequestBody
			var err error

			if err = c.Bind(&reqBody); err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			if strings.ToLower(os.Getenv("DEV")) != "true" {
				records, err := app.Dao().FindRecordsByExpr(runResultsCollectionName,
					dbx.HashExp{"run_id": reqBody.Meta.RunId},
				)
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}
				if len(records) != 0 {
					for i := 0; i < len(records); i++ {
						record := records[i]
						if record.GetBool("is_success") {
							return echo.NewHTTPError(http.StatusNotAcceptable, "This run_id ("+reqBody.Meta.RunId+") is already registered")
						}
						app.Dao().DeleteRecord(record)
					}
				}

				err = utils.CheckRunIdIsValid(&reqBody.Meta)
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}
			}

			workspace, err := GetWorkspaceByMeta(app, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			err = updateWorkspaceWithSha(app, workspace, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			runResultsCollection, err := app.Dao().FindCollectionByNameOrId(runResultsCollectionName)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			err = utils.CheckGithubFolderContent(&reqBody.Meta, app)
			if err != nil {
				record := models.NewRecord(runResultsCollection)
				record.Set("workspace", workspace.Id)
				record.Set("run_id", reqBody.Meta.RunId)
				record.Set("task", nil)
				record.Set("execution_time", nil)
				record.Set("output_similarity", nil)
				record.Set("status", "flowFail")
				record.Set("output", "")
				record.Set("stderr", err)
				record.Set("returncode", nil)
				record.Set("is_success", false)
				record.Set("sha", reqBody.Meta.Sha)
				app.Dao().SaveRecord(record)

				data := &recordData{
					Action: "create",
					Record: nil,
				}

				utils.BroadcastAny(app, "run_statistics/*", data)
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			counter := 0
			unknownTasks := []string{}
			hamming := metrics.NewHamming()
			registeredTasks := utils.GetRegisteredTasks(app, true)
			for task, data := range reqBody.Tasks {
				regTask := utils.ContainsWithLambda(registeredTasks, func(value utils.Task) bool {
					return value.Name == task
				})
				if regTask == nil {
					unknownTasks = append(unknownTasks, task)
					continue
				}

				item := models.NewRecord(runResultsCollection)
				form := forms.NewRecordUpsert(app, item)

				output_similarity := strutil.Similarity(data.Output, regTask.EtalonResultContent, hamming)

				status := "success"
				if data.Returncode == 124 {
					status = "timeout"
				} else if data.Stderr != "" {
					status = "fail"
				}

				form.LoadData(map[string]any{
					"workspace":         workspace.Id,
					"run_id":            reqBody.Meta.RunId,
					"task":              task,
					"execution_time":    data.Execution_time,
					"output_similarity": output_similarity,
					"status":            status,
					"output":            data.Output,
					"stderr":            data.Stderr,
					"returncode":        data.Returncode,
					"is_success":        true,
					"sha":               reqBody.Meta.Sha,
				})

				form.Submit()

				counter += 1
			}

			workspace_event, _ := GetWorkspaceEventByWorkspace(app, workspace)
			workspace_event.Set("new_run_started", nil)
			app.Dao().SaveRecord(workspace_event)

			retMsg := strconv.Itoa(counter) + " new record(s) generated"
			if len(unknownTasks) != 0 {
				sort.Strings(unknownTasks)
				retMsg = retMsg + ", Unknown tasks: " + strings.Join(unknownTasks, ", ")
			}

			resBody := &types.GithubResponseBody{
				Code:    201,
				Message: retMsg,
			}

			data := &recordData{
				Action: "create",
				Record: nil,
			}

			utils.BroadcastAny(app, "run_statistics/*", data)
			return c.JSON(http.StatusCreated, resBody)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			apis.RequireGuestOnly(),
		},
	})
}

func updateWorkspaceWithSha(app *pocketbase.PocketBase, workspace *models.Record, meta *types.GithubMetaType) error {
	now := time.Now()
	record, err := utils.GetGlobalValueByKey(app, utils.EventEndDataTime)
	if err != nil {
		return err
	}
	end_date := record.GetDateTime("value")
	if now.Sub(end_date.Time()).Minutes() >= 0 {
		return errors.New("Event is already over")
	}

	workspace.Set("last_valid_sha", meta.Sha)
	return app.Dao().SaveRecord(workspace)
}
