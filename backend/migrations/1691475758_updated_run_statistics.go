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

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT\n    run_results.workspace AS id,\n    AVG(run_results.execution_time) AS average_execution_time,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    (SELECT SUM(CASE WHEN run_results.is_success=TRUE THEN 1 ELSE 0 END) FROM run_results GROUP BY run_results.run_id) AS number_of_green_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("zpjdg98p")

		// remove
		collection.Schema.RemoveField("ao6wdmfr")

		// remove
		collection.Schema.RemoveField("po0ecdsg")

		// add
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "dtl9hr3h",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_execution_time)
		collection.Schema.AddField(new_average_execution_time)

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "htr8qxmt",
			"name": "number_of_runs",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_number_of_runs)
		collection.Schema.AddField(new_number_of_runs)

		// add
		new_number_of_green_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "olp8xnym",
			"name": "number_of_green_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_green_runs)
		collection.Schema.AddField(new_number_of_green_runs)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT\n    run_results.workspace AS id,\n    AVG(run_results.execution_time) AS average_execution_time,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    SUM(CASE WHEN run_results.is_success=TRUE THEN 1 ELSE 0 END) AS number_of_green_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "zpjdg98p",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_execution_time)
		collection.Schema.AddField(del_average_execution_time)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ao6wdmfr",
			"name": "number_of_runs",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), del_number_of_runs)
		collection.Schema.AddField(del_number_of_runs)

		// add
		del_number_of_green_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "po0ecdsg",
			"name": "number_of_green_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_green_runs)
		collection.Schema.AddField(del_number_of_green_runs)

		// remove
		collection.Schema.RemoveField("dtl9hr3h")

		// remove
		collection.Schema.RemoveField("htr8qxmt")

		// remove
		collection.Schema.RemoveField("olp8xnym")

		return dao.SaveCollection(collection)
	})
}
