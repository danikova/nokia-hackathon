package events

import (
	"hackathon-backend/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func enforceReadonlyFieldsByUser(app *pocketbase.PocketBase, e *core.RecordUpdateEvent, editableFields []string) {
	originalRecord, err := app.Dao().FindRecordById(e.Record.Collection().Name, e.Record.Id, nil)
	if err != nil {
		return
	}

	for _, field := range e.Record.Collection().Schema.Fields() {
		fieldKey := field.Name
		if !utils.Contains(editableFields, fieldKey) && e.Record.Get(fieldKey) != originalRecord.Get(fieldKey) {
			e.Record.Set(fieldKey, originalRecord.Get(fieldKey))
		}
	}
}

func OnRecordBeforeUpdateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		if e.Record.Collection().Name == "workspaces" {
			enforceReadonlyFieldsByUser(app, e, []string{"repo_url"})
		}
		return nil
	})
}
