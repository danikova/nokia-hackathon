package events

import (
	"hackathon-backend/src/crons"
	"hackathon-backend/src/views"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func OnBeforeServe(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/files/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./frontend"), false))
		e.Router.HTTPErrorHandler = customHTTPErrorHandler

		views.AddGithubBotStarted(app, e)
		views.AddGithubBotFinished(app, e)
		views.AddGetRunResultsSumView(app, e)
		views.AddGetRunStatisticsView(app, e)

		crons.AddUpdateStaleRunTimers(app)

		return nil
	})
}

var defaultHTTPErrorHandler = echo.DefaultHTTPErrorHandler(false)

func customHTTPErrorHandler(c echo.Context, err error) {
	if he, ok := err.(*echo.HTTPError); ok {
		if he.Code == http.StatusNotFound && c.Path() == "/*" {
			c.File("./frontend/index.html")
		} else {
			defaultHTTPErrorHandler(c, err)
		}
	} else {
		defaultHTTPErrorHandler(c, err)
	}
}
