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

		// remove
		collection.Schema.RemoveField("guf80k58")

		// add
		new_output := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "femhxzh9",
			"name": "output",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_output)
		collection.Schema.AddField(new_output)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("6ga4u2q0yqx7nfd")
		if err != nil {
			return err
		}

		// add
		del_output := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "guf80k58",
			"name": "output",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_output)
		collection.Schema.AddField(del_output)

		// remove
		collection.Schema.RemoveField("femhxzh9")

		return dao.SaveCollection(collection)
	})
}
