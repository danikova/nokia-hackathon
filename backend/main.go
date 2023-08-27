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

	e.OnRecordBeforeUpdateRequest(app)
	e.OnRecordAfterCreateRequest(app)
	e.OnBeforeServe(app)
	e.OnAfterBootstrap(app)
	e.OnRecordBeforeAuth(app)
	e.OnRecordAfterAuth(app)
	e.OnRecordsListRequest(app)

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: false,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
