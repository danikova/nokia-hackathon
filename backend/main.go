package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	_ "hackathon-backend/migrations"
)

func main() {
	app := pocketbase.New()

	OnRecordAfterCreateRequest(app)

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: true,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func OnRecordAfterCreateRequest(app *pocketbase.PocketBase) {
	addWorkspaceOnNewUser := func(e *core.RecordCreateEvent) error {
		targetCollection := "workspaces"
		userFieldKey := "user"
		userId := e.Record.Id

		collection, err := app.Dao().FindCollectionByNameOrId(targetCollection)
		if err != nil {
			return err
		}

		record := models.NewRecord(collection)
		record.Set(userFieldKey, userId)

		if err := app.Dao().SaveRecord(record); err != nil {
			return err
		}

		log.Println("new workspace", record.Id, "generated for user", userId)
		return nil
	}

	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == "users" {
			err := addWorkspaceOnNewUser(e)
			if err == nil {
				return err
			}
		}
		return nil
	})
}
