package events

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

var RankingsCollectionName = "rankings"

func OnRecordsListRequest(app *pocketbase.PocketBase) {
	app.OnRecordsListRequest(WorkspaceRankingsCollectionName).Add(func(e *core.RecordsListEvent) error {
		for _, record := range e.Records {
			workspaceId := record.GetString("workspace")
			if workspaceId != "" {
				workspace, err := app.Dao().FindRecordById(WorkspacesCollectionName, workspaceId)
				if err != nil {
					return err
				}
				rankings, err := app.Dao().FindRecordsByExpr(RankingsCollectionName,
					dbx.HashExp{WorkspaceFieldKey: workspaceId},
				)
				if err != nil {
					return err
				}
				record.SetExpand(map[string]any{
					"workspace": workspace,
					"rankings":  rankings,
				})
			}
		}
		return nil
	})
}
