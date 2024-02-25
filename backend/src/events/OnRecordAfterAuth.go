package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordAfterAuth(app *pocketbase.PocketBase) {
	app.OnRecordAfterAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		record, _ := app.Dao().FindFirstRecordByData(tables.WorkspacesCollectionName, tables.UserFieldKey, e.Record.Id)
		if record == nil {
			utils.CreateWorkspaceForUser(app, &e.Record.Id)
		}

		fields := map[string]string{
			"username":  e.OAuth2User.Username,
			"name":      e.OAuth2User.Name,
			"avatarUrl": e.OAuth2User.AvatarUrl,
		}

		for key, value := range fields {
			if value != "" {
				e.Record.Set(key, value)
			}
		}

		return app.Dao().SaveRecord(e.Record)
	})
}
