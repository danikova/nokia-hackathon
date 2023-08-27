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
var WorkspaceRankingsCollectionName = "workspace_rankings"

var UserFieldKey = "user"
var WorkspaceFieldKey = "workspace"
var RankingsFieldKey = "rankings"

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	workspaces, err := app.Dao().FindCollectionByNameOrId(WorkspacesCollectionName)
	if err != nil {
		return err
	}

	workspace_events, err := app.Dao().FindCollectionByNameOrId(WorkspaceEventsCollectionName)
	if err != nil {
		return err
	}

	workspace_rankings, err := app.Dao().FindCollectionByNameOrId(WorkspaceRankingsCollectionName)
	if err != nil {
		return err
	}

	workspaceRecord := models.NewRecord(workspaces)
	workspaceRecord.Set(UserFieldKey, userId)
	app.Dao().SaveRecord(workspaceRecord)

	workspaceEventRecord := models.NewRecord(workspace_events)
	workspaceEventRecord.Set(WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceEventRecord)

	workspaceRankingRecord := models.NewRecord(workspace_rankings)
	workspaceRankingRecord.Set(WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceRankingRecord)

	log.Println("new workspace", workspaceRecord.Id, "generated for user", userId)
	log.Println("new workspace event", workspaceEventRecord.Id, "generated for workspace", workspaceRecord)
	return nil
}
