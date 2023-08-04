package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("6ga4u2q0yqx7nfd")
		if err != nil {
			return err
		}

		// add
		new_stderr := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wq7ebzds",
			"name": "stderr",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_stderr)
		collection.Schema.AddField(new_stderr)

		// add
		new_returncode := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xetb5mty",
			"name": "returncode",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_returncode)
		collection.Schema.AddField(new_returncode)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("6ga4u2q0yqx7nfd")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("wq7ebzds")

		// remove
		collection.Schema.RemoveField("xetb5mty")

		return dao.SaveCollection(collection)
	})
}
