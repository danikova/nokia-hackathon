package events

import (
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

type GithubMetaType struct {
	Repository string `json:"repository"`
	Run_id     string `json:"run_id"`
}

type GithubTaskType struct {
	Output         string  `json:"output"`
	Execution_time float32 `json:"execution_time"`
}

type GithubRequestBody struct {
	Meta  GithubMetaType            `json:"meta"`
	Tasks map[string]GithubTaskType `json:"tasks"`
}

type GithubResponseBody struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

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
				var reqBody GithubRequestBody
				run_results_collection := "run_results"
				workspaces_collection := "workspaces"

				if err := c.Bind(&reqBody); err != nil {
					return err
				}

				records, err := app.Dao().FindRecordsByExpr(run_results_collection,
					dbx.HashExp{"run_id": reqBody.Meta.Run_id},
				)
				if err != nil {
					return err
				}
				if len(records) != 0 {
					return echo.NewHTTPError(http.StatusNotAcceptable, "This run_id ("+reqBody.Meta.Run_id+") is already registered")
				}

				repo_url := "https://github.com/" + reqBody.Meta.Repository

				workspace, err := app.Dao().FindFirstRecordByData(workspaces_collection, "repo_url", repo_url)
				if err != nil {
					return err
				}
				if workspace == nil {
					return echo.NewHTTPError(http.StatusNotAcceptable, "This repository ("+reqBody.Meta.Repository+") is not connected with any workspace")
				}

				collection, err := app.Dao().FindCollectionByNameOrId(run_results_collection)
				if err != nil {
					return err
				}

				counter := 0
				for task, data := range reqBody.Tasks {

					item := models.NewRecord(collection)
					form := forms.NewRecordUpsert(app, item)

					form.LoadData(map[string]any{
						"workspace":      workspace.Id,
						"run_id":         reqBody.Meta.Run_id,
						"task":           task,
						"output":         data.Output[0:min(len(data.Output), 1000)],
						"execution_time": data.Execution_time,
					})

					if err := form.Submit(); err != nil {
						return err
					}

					counter += 1
				}

				resBody := &GithubResponseBody{
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
