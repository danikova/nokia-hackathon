package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"hackathon-backend/src/events"
)

func main() {
	godotenv.Load(".env")
	app := pocketbase.New()

	events.InitializeEvents(app)

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  true,
		Dir:          "pb_migrations",
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
