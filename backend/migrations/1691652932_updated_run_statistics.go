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
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    ROUND(AVG(LENGTH(run_results.output))) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("gnhxrjje")

		// remove
		collection.Schema.RemoveField("jxcmv1ar")

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "bpoktvxr",
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
		new_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "uifyejhj",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_output_length)
		collection.Schema.AddField(new_average_output_length)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    AVG(LENGTH(run_results.output)) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "gnhxrjje",
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
		del_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "jxcmv1ar",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// remove
		collection.Schema.RemoveField("bpoktvxr")

		// remove
		collection.Schema.RemoveField("uifyejhj")

		return dao.SaveCollection(collection)
	})
}
