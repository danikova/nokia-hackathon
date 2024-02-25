package views

import (
	"hackathon-backend/src/types"
	"hackathon-backend/src/utils"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func AddGithubBotStarted(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/github-bot-started/",
		Handler: func(c echo.Context) error {
			var reqBody types.GithubRequestBody
			var err error

			if err = c.Bind(&reqBody); err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			workspace, err := utils.GetWorkspaceByMeta(app, &reqBody.Meta)
			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err)
			}

			workspace_event, err := utils.GetWorkspaceEventByWorkspace(app, workspace)
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