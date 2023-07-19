package events

import (
	"hackathon-backend/utils"
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnAfterBootstrap(app *pocketbase.PocketBase) {
	app.OnAfterBootstrap().Add(func(e *core.BootstrapEvent) error {
		args := os.Args[1:]
		if utils.Contains(args, "migrate") {
			return nil
		}

		collection, _ := app.Dao().FindCollectionByNameOrId(utils.GlobalCollectionName)
		if collection == nil {
			log.Panic("please migrate the database")
		}

		for i := 0; i < len(utils.FixGlobalKeys); i++ {
			fixGlobalKey := utils.FixGlobalKeys[i]
			_, err := app.Dao().FindFirstRecordByData(utils.GlobalCollectionName, utils.GlobalCollectionKeyName, fixGlobalKey)
			if err != nil {
				record := models.NewRecord(collection)
				record.Set(utils.GlobalCollectionKeyName, fixGlobalKey)

				app.Dao().SaveRecord(record)
			}
		}

		return nil
	})
}
