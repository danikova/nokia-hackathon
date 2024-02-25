package utils

import (
	"fmt"
	"hackathon-backend/src/tables"
	"hackathon-backend/src/types"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func GetWorkspaceByMeta(app *pocketbase.PocketBase, m *types.GithubMetaType) (*models.Record, error) {
	repoURL := "https://github.com/" + m.Repository
	workspace, err := app.Dao().FindFirstRecordByData(tables.WorkspacesCollectionName, "repo_url", repoURL)
	if err != nil || workspace == nil {
			return nil, fmt.Errorf("could not find workspace for repository %s: %w", m.Repository, err)
	}
	return workspace, nil
}

func GetWorkspaceEventByWorkspace(app *pocketbase.PocketBase, workspace *models.Record) (*models.Record, error) {
	workspaceEvent, err := app.Dao().FindFirstRecordByData(tables.WorkspaceEventsCollectionName, "workspace", workspace.Id)
	if err != nil || workspaceEvent == nil {
		return nil, fmt.Errorf("could not find workspace event for workspace id %s: %w", workspace.Id, err)
	}
	return workspaceEvent, nil
}

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	collections := []string{tables.WorkspacesCollectionName, tables.WorkspaceEventsCollectionName, tables.WorkspaceRankingsCollectionName}
	collectionsMap, err := GetCollections(app, collections)
	if err != nil {
		return fmt.Errorf("could not get collections: %w", err)
	}

	workspaceRecord := models.NewRecord(collectionsMap[tables.WorkspacesCollectionName])
	workspaceRecord.Set(tables.UserFieldKey, userId)
	app.Dao().SaveRecord(workspaceRecord)

	workspaceEventRecord := models.NewRecord(collectionsMap[tables.WorkspaceEventsCollectionName])
	workspaceEventRecord.Set(tables.WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceEventRecord)

	workspaceRankingRecord := models.NewRecord(collectionsMap[tables.WorkspaceRankingsCollectionName])
	workspaceRankingRecord.Set(tables.WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceRankingRecord)

	log.Println("new workspace", workspaceRecord.Id, "generated for user", userId)
	log.Println("new workspace event", workspaceEventRecord.Id, "generated for workspace", workspaceRecord)
	return nil
}
