package views

import (
	"errors"
	"hackathon-backend/src/tables"
	"hackathon-backend/src/types"
	"hackathon-backend/src/utils"
	"net/http"
	"os"
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
)

type recordData struct {
	Action string         `json:"action"`
	Record *models.Record `json:"record"`
}

func AddGithubBotFinished(app *pocketbase.PocketBase, e *core.ServeEvent) {
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
				records, err := app.Dao().FindRecordsByExpr(tables.RunResultsCollectionName,
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

			workspace, err := utils.GetWorkspaceByMeta(app, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			err = updateWorkspaceWithSha(app, workspace, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			runResultsCollection, err := app.Dao().FindCollectionByNameOrId(tables.RunResultsCollectionName)
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
			met := metrics.NewJaccard()
			met.CaseSensitive = false
			met.NgramSize = 3
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

				stripedOutput := strings.TrimSpace(data.Output)
				stripedEtalonResultContent := strings.TrimSpace(regTask.EtalonResultContent)
				output_similarity := strutil.Similarity(stripedOutput, stripedEtalonResultContent, met)

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

			workspace_event, _ := utils.GetWorkspaceEventByWorkspace(app, workspace)
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
