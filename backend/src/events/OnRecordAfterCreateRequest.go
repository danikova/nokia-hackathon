package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordAfterCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordAfterCreateRequest(tables.UsersCollectionName).Add(func(e *core.RecordCreateEvent) error {
		return utils.CreateWorkspaceForUser(app, &e.Record.Id)
	})
}
