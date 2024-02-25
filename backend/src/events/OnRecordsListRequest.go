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
	expandWorkspaceRankingsCollectionListRequest(app)
}

func expandWorkspaceRankingsCollectionListRequest(app *pocketbase.PocketBase) {
	app.OnRecordsListRequest(utils.RunTasksCollectionName).Add(func(e *core.RecordsListEvent) error {
		info := apis.RequestData(e.HttpContext)
		if info.Admin == nil {
			for _, record := range e.Records {
				record.Set("etalon_result", ":(")
			}
		}
		return nil
	})

	app.OnRecordsListRequest(tables.WorkspaceRankingsCollectionName).Add(func(e *core.RecordsListEvent) error {
		expandList := utils.Map(strings.Split(e.HttpContext.QueryParam("expand"), ","), func(qp string) string {
			return strings.TrimSpace(qp)
		})

		for _, record := range e.Records {
			workspaceId := record.GetString("workspace")
			if workspaceId != "" {

				rankings, err := app.Dao().FindRecordsByExpr(tables.RankingsCollectionName,
					dbx.HashExp{tables.WorkspaceFieldKey: workspaceId},
				)

				rankingIds := utils.Map(rankings, func(ranking *models.Record) string {
					return ranking.Id
				})
				if err != nil {
					return err
				}

				expandMap := map[string]any{}
				if utils.Contains(expandList, tables.WorkspaceFieldKey) {
					workspace, err := app.Dao().FindRecordById(tables.WorkspacesCollectionName, workspaceId)
					if err != nil {
						return err
					}
					expandMap[tables.WorkspaceFieldKey] = workspace
				}
				if utils.Contains(expandList, tables.RankingsFieldKey) {
					expandMap[tables.RankingsFieldKey] = rankings
				}
				record.SetExpand(expandMap)
				record.Set(tables.RankingsFieldKey, rankingIds)
			}
		}
		return nil
	})
}
