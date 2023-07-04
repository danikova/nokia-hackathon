package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	e "hackathon-backend/events"
	_ "hackathon-backend/migrations"
)

func main() {
	app := pocketbase.New()

	e.OnRecordAfterCreateRequest(app)
	e.OnBeforeServe(app)

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: true,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
