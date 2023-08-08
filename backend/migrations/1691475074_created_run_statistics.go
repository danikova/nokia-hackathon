package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "t78tnkzbxipdjl9",
			"created": "2023-08-08 06:11:14.637Z",
			"updated": "2023-08-08 06:11:14.637Z",
			"name": "run_statistics",
			"type": "view",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "jcr7fs0i",
					"name": "average_execution_time",
					"type": "json",
					"required": false,
					"unique": false,
					"options": {}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"query": "SELECT\n    run_results.workspace as id,\n    avg(run_results.execution_time) as average_execution_time\nFROM run_results\nGROUP BY run_results.workspace"
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
