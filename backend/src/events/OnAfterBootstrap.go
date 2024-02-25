package events

import (
	"hackathon-backend/src/utils"
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnAfterBootstrap(app *pocketbase.PocketBase) {
	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		if utils.Contains(os.Args[1:], "migrate") {
			return nil
		}

		collection, _ := app.Dao().FindCollectionByNameOrId(utils.GlobalCollectionName)
		if collection == nil {
			log.Panic("please migrate the database")
		}

		for _, fixGlobalKey := range utils.FixGlobalKeys {
			if _, err := app.Dao().FindFirstRecordByData(utils.GlobalCollectionName, utils.GlobalCollectionKeyName, fixGlobalKey); err != nil {
				record := models.NewRecord(collection)
				record.Set(utils.GlobalCollectionKeyName, fixGlobalKey)
				app.Dao().SaveRecord(record)
			}
		}

		return nil
	})
}
