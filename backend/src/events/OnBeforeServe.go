package events

import (
	"hackathon-backend/src/crons"
	"hackathon-backend/src/views"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func OnBeforeServe(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/files/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		views.AddGithubBotStarted(app, e)
		views.AddGithubBotFinished(app, e)
		views.AddGetRunResultsSumView(app, e)
		views.AddGetRunStatisticsView(app, e)

		crons.AddUpdateStaleRunTimers(app)

		return nil
	})
}
