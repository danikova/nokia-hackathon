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
		new_task := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wk6c4qa2",
			"name": "task",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_task)
		collection.Schema.AddField(new_task)

		// add
		new_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ez7e9c7x",
			"name": "execution_time",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_execution_time)
		collection.Schema.AddField(new_execution_time)

		// update
		edit_output := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "guf80k58",
			"name": "output",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), edit_output)
		collection.Schema.AddField(edit_output)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("6ga4u2q0yqx7nfd")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("wk6c4qa2")

		// remove
		collection.Schema.RemoveField("ez7e9c7x")

		// update
		edit_output := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "guf80k58",
			"name": "run_result",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), edit_output)
		collection.Schema.AddField(edit_output)

		return dao.SaveCollection(collection)
	})
}
