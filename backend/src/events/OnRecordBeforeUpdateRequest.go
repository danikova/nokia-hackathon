package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordBeforeUpdateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeUpdateRequest(tables.WorkspacesCollectionName).Add(func(e *core.RecordUpdateEvent) error {
		utils.EnforceReadonlyFieldsByUser(app, e.Record, []string{"repo_url"})
		return nil
	})
	app.OnRecordBeforeUpdateRequest(tables.RankingsCollectionName).Add(func(e *core.RecordUpdateEvent) error {
		utils.EnforceReadonlyFieldsByUser(app, e.Record, []string{"points", "comments"})
		utils.SummarizePointsOnRanking(app, e.Record)
		return nil
	})
}
