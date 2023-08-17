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

var WorkspacesCollectionName = "workspaces"
var WorkspaceEventsCollectionName = "workspace_events"
var UserFieldKey = "user"
var WorkspaceFieldKey = "workspace"

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	workspaces, err := app.Dao().FindCollectionByNameOrId(WorkspacesCollectionName)
	if err != nil {
		return err
	}

	workspace_events, err := app.Dao().FindCollectionByNameOrId(WorkspaceEventsCollectionName)
	if err != nil {
		return err
	}

	workspaceRecord := models.NewRecord(workspaces)
	workspaceRecord.Set(UserFieldKey, userId)

	if err := app.Dao().SaveRecord(workspaceRecord); err != nil {
		return err
	}

	workspaceEventRecord := models.NewRecord(workspace_events)
	workspaceEventRecord.Set(WorkspaceFieldKey, workspaceRecord.Id)

	if err := app.Dao().SaveRecord(workspaceEventRecord); err != nil {
		return err
	}

	log.Println("new workspace", workspaceRecord.Id, "generated for user", userId)
	log.Println("new workspace event", workspaceEventRecord.Id, "generated for workspace", workspaceRecord)
	return nil
}
