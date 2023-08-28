package events

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordAfterUpdateRequest(app *pocketbase.PocketBase) {
	app.OnRecordAfterUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		if e.Record.Collection().Name == RankingsCollectionName {
			SummarizePointsOnRanking(app, e.Record)
		}
		return nil
	})
}
