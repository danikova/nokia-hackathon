package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	e "hackathon-backend/events"
	_ "hackathon-backend/migrations"
)

func main() {
	godotenv.Load(".env")
	app := pocketbase.New()

	e.OnBeforeServe(app)
	e.OnAfterBootstrap(app)
	e.OnRecordAfterAuth(app)
	e.OnRecordBeforeAuth(app)
	e.OnRecordsListRequest(app)
	e.OnRecordAfterCreateRequest(app)
	e.OnRecordAfterUpdateRequest(app)
	e.OnRecordBeforeUpdateRequest(app)
	e.OnRecordBeforeCreateRequest(app)

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: false,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
