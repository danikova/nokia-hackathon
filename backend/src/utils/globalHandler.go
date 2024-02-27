package utils

import (
	"hackathon-backend/src/tables"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

var PrimaryProjectKey = "primary_project"
var DisableLoginKey = "disable_login"
var EventEndDataTime = "event_end_date_time"

var FixGlobalKeys = []string{PrimaryProjectKey, DisableLoginKey, EventEndDataTime}

func GetGlobalValueByKey(app *pocketbase.PocketBase, key string) (*models.Record, error) {
	record, err := app.Dao().FindFirstRecordByData(tables.GlobalCollectionName, tables.GlobalCollectionKeyFieldKey, key)
	if err != nil {
		return nil, err
	}
	return record, nil
}
