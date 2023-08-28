package events

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordBeforeCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == RankingsCollectionName {
			enforceReadonlyFieldsByUser(app, e.Record, []string{"user", "workspace", "points", "comments"})
		}
		return nil
	})
}
