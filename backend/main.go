package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"hackathon-backend/src/events"
	_ "hackathon-backend/migrations"
)

func main() {
	godotenv.Load(".env")
	app := pocketbase.New()

	events.InitializeEvents(app)

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
		Automigrate: false,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
