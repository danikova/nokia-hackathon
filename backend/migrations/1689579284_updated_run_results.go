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
		new_is_success := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xhckppnl",
			"name": "is_success",
			"type": "bool",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_is_success)
		collection.Schema.AddField(new_is_success)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("6ga4u2q0yqx7nfd")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("xhckppnl")

		return dao.SaveCollection(collection)
	})
}
