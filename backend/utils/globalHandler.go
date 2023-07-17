package utils

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

var PrimaryProjectKey = "primary_project"
var DisableLoginKey = "disable_login"

var FixGlobalKeys = []string{PrimaryProjectKey, DisableLoginKey}
var GlobalCollectionName = "globals"
var GlobalCollectionKeyName = "key"

func GetGlobalValueByKey(app *pocketbase.PocketBase, key string) (*models.Record, error) {
	record, err := app.Dao().FindFirstRecordByData(GlobalCollectionName, GlobalCollectionKeyName, key)
	if err != nil {
		return nil, err
	}
	return record, nil
}
