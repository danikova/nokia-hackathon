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
			err := addWorkspaceOnNewUser(app, e)
			if err == nil {
				return err
			}
		}
		return nil
	})
}

func addWorkspaceOnNewUser(app *pocketbase.PocketBase, e *core.RecordCreateEvent) error {
	targetCollection := "workspaces"
	userFieldKey := "user"
	userId := e.Record.Id

	collection, err := app.Dao().FindCollectionByNameOrId(targetCollection)
	if err != nil {
		return err
	}

	record := models.NewRecord(collection)
	record.Set(userFieldKey, userId)

	if err := app.Dao().SaveRecord(record); err != nil {
		return err
	}

	log.Println("new workspace", record.Id, "generated for user", userId)
	return nil
}
