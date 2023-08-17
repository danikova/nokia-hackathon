package events

import (
	"errors"
	"hackathon-backend/types"
	"hackathon-backend/utils"
	"net/http"
	"os"
	"strconv"
	"time"

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

			workspace, err := GetWorkspaceByMeta(app, &reqBody.Meta)
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
				record.Set("is_success", false)
				record.Set("output", err)
				app.Dao().SaveRecord(record)
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			counter := 0
			for task, data := range reqBody.Tasks {

				item := models.NewRecord(runResultsCollection)
				form := forms.NewRecordUpsert(app, item)

				form.LoadData(map[string]any{
					"workspace":      workspace.Id,
					"run_id":         reqBody.Meta.RunId,
					"is_success":     true,
					"task":           task,
					"output":         data.Output,
					"stderr":         data.Stderr,
					"returncode":     data.Returncode,
					"execution_time": data.Execution_time,
				})

				if err := form.Submit(); err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}

				counter += 1
			}

			workspace_event, _ := GetWorkspaceEventByWorkspace(app, workspace)
			workspace_event.Set("new_run_started", nil)
			app.Dao().SaveRecord(workspace_event)

			resBody := &types.GithubResponseBody{
				Code:    201,
				Message: strconv.Itoa(counter) + " new record(s) generated",
			}

			return c.JSON(http.StatusCreated, resBody)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			apis.RequireGuestOnly(),
		},
	})
}
