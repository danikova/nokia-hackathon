package utils

import (
	"errors"
	"hackathon-backend/src/types"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func GetWorkspaceByMeta(app *pocketbase.PocketBase, m *types.GithubMetaType) (*models.Record, error) {
	repo_url := "https://github.com/" + m.Repository

	workspace, err := app.Dao().FindFirstRecordByData(WorkspacesCollectionName, "repo_url", repo_url)
	if workspace == nil {
		return nil, errors.New("This repository (" + m.Repository + ") is not connected with any workspace")
	}
	if err != nil {
		return nil, err
	}

	return workspace, nil
}

func GetWorkspaceEventByWorkspace(app *pocketbase.PocketBase, workspace *models.Record) (*models.Record, error) {
	workspace_event, err := app.Dao().FindFirstRecordByData(WorkspaceEventsCollectionName, "workspace", workspace.Id)
	if workspace_event == nil {
		return nil, errors.New("Workspace event not found, with workspace id" + workspace.Id)
	}
	if err != nil {
		return nil, err
	}

	return workspace_event, nil
}