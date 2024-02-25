package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnRecordsListRequest(app *pocketbase.PocketBase) {
	app.OnRecordsListRequest(utils.RunTasksCollectionName).Add(func(e *core.RecordsListEvent) error {
		if apis.RequestData(e.HttpContext).Admin == nil {
			for _, record := range e.Records {
				record.Set("etalon_result", ":(")
			}
		}
		return nil
	})
	app.OnRecordsListRequest(tables.WorkspaceRankingsCollectionName).Add(func(e *core.RecordsListEvent) error {
		expandList := utils.Map(strings.Split(e.HttpContext.QueryParam("expand"), ","), strings.TrimSpace)

		for _, record := range e.Records {
			workspaceId := record.GetString("workspace")
			if workspaceId != "" {
				rankings, err := getRankings(app, workspaceId)
				if err != nil {
					return err
				}

				expandMap, err := buildExpandMapForWorkspaceRankings(app, expandList, workspaceId, rankings)
				if err != nil {
					return err
				}

				record.SetExpand(expandMap)
				record.Set(tables.RankingsFieldKey, utils.Map(rankings, func(ranking *models.Record) string {
					return ranking.Id
				}))
			}
		}
		return nil
	})
}

func getRankings(app *pocketbase.PocketBase, workspaceId string) ([]*models.Record, error) {
	return app.Dao().FindRecordsByExpr(tables.RankingsCollectionName, dbx.HashExp{tables.WorkspaceFieldKey: workspaceId})
}

func buildExpandMapForWorkspaceRankings(app *pocketbase.PocketBase, expandList []string, workspaceId string, rankings []*models.Record) (map[string]any, error) {
	expandMap := map[string]any{}
	if utils.Contains(expandList, tables.WorkspaceFieldKey) {
		workspace, err := app.Dao().FindRecordById(tables.WorkspacesCollectionName, workspaceId)
		if err != nil {
			return nil, err
		}
		expandMap[tables.WorkspaceFieldKey] = workspace
	}
	if utils.Contains(expandList, tables.RankingsFieldKey) {
		expandMap[tables.RankingsFieldKey] = rankings
	}
	return expandMap, nil
}
