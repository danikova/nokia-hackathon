package events

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func OnBeforeServe(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/github-bot-register/",
			Handler: func(c echo.Context) error {
				return c.JSON(http.StatusOK, nil)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireGuestOnly(),
			},
		})

		return nil
	})
}
