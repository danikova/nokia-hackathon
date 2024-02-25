package events

import (
	"hackathon-backend/src/tables"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnRecordAfterCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == tables.UsersCollectionName {
			CreateWorkspaceForUser(app, &e.Record.Id)
		}
		return nil
	})
}

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	workspaces, err := app.Dao().FindCollectionByNameOrId(tables.WorkspacesCollectionName)
	if err != nil {
		return err
	}

	workspace_events, err := app.Dao().FindCollectionByNameOrId(tables.WorkspaceEventsCollectionName)
	if err != nil {
		return err
	}

	workspace_rankings, err := app.Dao().FindCollectionByNameOrId(tables.WorkspaceRankingsCollectionName)
	if err != nil {
		return err
	}

	workspaceRecord := models.NewRecord(workspaces)
	workspaceRecord.Set(tables.UserFieldKey, userId)
	app.Dao().SaveRecord(workspaceRecord)

	workspaceEventRecord := models.NewRecord(workspace_events)
	workspaceEventRecord.Set(tables.WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceEventRecord)

	workspaceRankingRecord := models.NewRecord(workspace_rankings)
	workspaceRankingRecord.Set(tables.WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceRankingRecord)

	log.Println("new workspace", workspaceRecord.Id, "generated for user", userId)
	log.Println("new workspace event", workspaceEventRecord.Id, "generated for workspace", workspaceRecord)
	return nil
}
