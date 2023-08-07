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

		// update
		edit_left_image := &schema.SchemaField{}
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
				"mimeTypes": [
					"image/jpeg",
					"image/png",
					"image/webp"
				],
				"thumbs": [],
				"protected": false
			}
		}`), edit_left_image)
		collection.Schema.AddField(edit_left_image)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("u71l7zif871cq02")
		if err != nil {
			return err
		}

		// update
		edit_left_image := &schema.SchemaField{}
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
		}`), edit_left_image)
		collection.Schema.AddField(edit_left_image)

		return dao.SaveCollection(collection)
	})
}
