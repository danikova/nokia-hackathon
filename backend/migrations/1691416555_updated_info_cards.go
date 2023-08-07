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

		collection, err := dao.FindCollectionByNameOrId("u71l7zif871cq02")
		if err != nil {
			return err
		}

		// add
		new_left_image := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "lqle4jml",
			"name": "left_image",
			"type": "file",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"maxSize": 5242880,
				"mimeTypes": [],
				"thumbs": [],
				"protected": false
			}
		}`), new_left_image)
		collection.Schema.AddField(new_left_image)

		// add
		new_right_image := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "rnvf3x5n",
			"name": "right_image",
			"type": "file",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"maxSize": 5242880,
				"mimeTypes": [],
				"thumbs": [],
				"protected": false
			}
		}`), new_right_image)
		collection.Schema.AddField(new_right_image)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("u71l7zif871cq02")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("lqle4jml")

		// remove
		collection.Schema.RemoveField("rnvf3x5n")

		return dao.SaveCollection(collection)
	})
}
