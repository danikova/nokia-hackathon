package crons

import (
	"hackathon-backend/src/tables"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/cron"
)

func AddUpdateStaleRunTimers(app *pocketbase.PocketBase) {
	scheduler := cron.New()

	workspaceEventsCleanup := func() {
		records, _ := app.Dao().FindRecordsByExpr(tables.WorkspaceEventsCollectionName,
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