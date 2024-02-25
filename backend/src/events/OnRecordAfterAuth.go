package events

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordAfterAuth(app *pocketbase.PocketBase) {
	app.OnRecordAfterAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		if record, _ := app.Dao().FindFirstRecordByData(WorkspacesCollectionName, UserFieldKey, e.Record.Id); record == nil {
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

		if err := app.Dao().SaveRecord(e.Record); err != nil {
			return err
		}

		return nil
	})
}
