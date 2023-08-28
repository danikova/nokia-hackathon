package events

import (
	"hackathon-backend/utils"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnRecordsListRequest(app *pocketbase.PocketBase) {
	expandWorkspaceRankingsCollectionListRequest(app)
}

func expandWorkspaceRankingsCollectionListRequest(app *pocketbase.PocketBase) {
	app.OnRecordsListRequest(WorkspaceRankingsCollectionName).Add(func(e *core.RecordsListEvent) error {
		expandList := utils.Map(strings.Split(e.HttpContext.QueryParam("expand"), ","), func(qp string) string {
			return strings.TrimSpace(qp)
		})

		for _, record := range e.Records {
			workspaceId := record.GetString("workspace")
			if workspaceId != "" {

				rankings, err := app.Dao().FindRecordsByExpr(RankingsCollectionName,
					dbx.HashExp{WorkspaceFieldKey: workspaceId},
				)

				rankingIds := utils.Map(rankings, func(ranking *models.Record) string {
					return ranking.Id
				})
				if err != nil {
					return err
				}

				expandMap := map[string]any{}
				if utils.Contains(expandList, WorkspaceFieldKey) {
					workspace, err := app.Dao().FindRecordById(WorkspacesCollectionName, workspaceId)
					if err != nil {
						return err
					}
					expandMap[WorkspaceFieldKey] = workspace
				}
				if utils.Contains(expandList, RankingsFieldKey) {
					expandMap[RankingsFieldKey] = rankings
				}
				record.SetExpand(expandMap)
				record.Set(RankingsFieldKey, rankingIds)
			}
		}
		return nil
	})
}
