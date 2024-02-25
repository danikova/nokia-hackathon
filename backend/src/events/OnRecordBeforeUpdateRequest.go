package events

import (
	"hackathon-backend/src/utils"
	"reflect"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func enforceReadonlyFieldsByUser(app *pocketbase.PocketBase, record *models.Record, editableFields []string) {
	originalRecord, err := app.Dao().FindRecordById(record.Collection().Name, record.Id, nil)
	if err != nil {
		return
	}

	for _, field := range record.Collection().Schema.Fields() {
		fieldKey := field.Name
		if !utils.Contains(editableFields, fieldKey) && !reflect.DeepEqual(record.Get(fieldKey), originalRecord.Get(fieldKey)) {
			record.Set(fieldKey, originalRecord.Get(fieldKey))
		}
	}
}

func OnRecordBeforeUpdateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		if e.Record.Collection().Name == WorkspacesCollectionName {
			enforceReadonlyFieldsByUser(app, e.Record, []string{"repo_url"})
		}
		if e.Record.Collection().Name == RankingsCollectionName {
			enforceReadonlyFieldsByUser(app, e.Record, []string{"points", "comments"})
			SummarizePointsOnRanking(app, e.Record)
		}
		return nil
	})
}
