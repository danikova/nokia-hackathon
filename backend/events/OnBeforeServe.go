package events

import (
	"hackathon-backend/types"
	"hackathon-backend/utils"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
)

var runResultsCollectionName = "run_results"
var workspacesCollectionName = "workspaces"

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func OnBeforeServe(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/github-bot-register/",
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
					return echo.NewHTTPError(http.StatusNotAcceptable, "This run_id ("+reqBody.Meta.RunId+") is already registered")
				}

				err = utils.CheckRunIdIsValid(&reqBody.Meta)
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}

				repo_url := "https://github.com/" + reqBody.Meta.Repository

				workspace, err := app.Dao().FindFirstRecordByData(workspacesCollectionName, "repo_url", repo_url)
				if workspace == nil {
					return echo.NewHTTPError(http.StatusNotAcceptable, "This repository ("+reqBody.Meta.Repository+") is not connected with any workspace")
				}
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}

				runResultsCollection, err := app.Dao().FindCollectionByNameOrId(runResultsCollectionName)
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, err)
				}

				primaryProject, err := utils.GetGlobalValueByKey(app, utils.PrimaryProjectKey)
				if err != nil {
					return echo.NewHTTPError(http.StatusBadRequest, "primary_project not found")
				}

				err = utils.CheckGithubFolderContent(&reqBody.Meta, primaryProject)
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
						"output":         data.Output[0:min(len(data.Output), 1000)],
						"execution_time": data.Execution_time,
					})

					if err := form.Submit(); err != nil {
						return echo.NewHTTPError(http.StatusBadRequest, err)
					}

					counter += 1
				}

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

		return nil
	})
}
