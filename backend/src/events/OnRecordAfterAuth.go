package events

import (
	"hackathon-backend/src/tables"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordAfterAuth(app *pocketbase.PocketBase) {
	app.OnRecordAfterAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		record, _ := app.Dao().FindFirstRecordByData(tables.WorkspacesCollectionName, tables.UserFieldKey, e.Record.Id)
		if record == nil {
			CreateWorkspaceForUser(app, &e.Record.Id)
		}

		if e.OAuth2User.Username != "" {
			e.Record.Set("username", e.OAuth2User.Username)
		}
		if e.OAuth2User.Name != "" {
			e.Record.Set("name", e.OAuth2User.Name)
		}
		if e.OAuth2User.AvatarUrl != "" {
			e.Record.Set("avatarUrl", e.OAuth2User.AvatarUrl)
		}

		return app.Dao().SaveRecord(e.Record)
	})
}
