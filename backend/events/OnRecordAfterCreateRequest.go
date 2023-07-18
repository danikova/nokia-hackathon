package events

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnRecordAfterCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == "users" {
			CreateWorkspaceForUser(app, &e.Record.Id)
		}
		return nil
	})
}

var WorkspaceCollectionName = "workspaces"
var UserFieldKey = "user"

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	collection, err := app.Dao().FindCollectionByNameOrId(WorkspaceCollectionName)
	if err != nil {
		return err
	}

	record := models.NewRecord(collection)
	record.Set(UserFieldKey, userId)

	if err := app.Dao().SaveRecord(record); err != nil {
		return err
	}

	log.Println("new workspace", record.Id, "generated for user", userId)
	return nil
}
