package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordBeforeCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeCreateRequest(tables.RankingsCollectionName).Add(func(e *core.RecordCreateEvent) error {
		utils.EnforceReadonlyFieldsByUser(app, e.Record, []string{"user", "workspace", "points", "comments"})
		utils.SummarizePointsOnRanking(app, e.Record)
		return nil
	})
}
