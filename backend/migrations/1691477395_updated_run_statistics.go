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
			"query": "SELECT\n    run_results.workspace AS id,\n    AVG(run_results.execution_time) AS average_execution_time,\n    AVG(LENGTH(run_results.output)) AS average_output_length,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_distinct_runs,\n    (SELECT SUM(CASE run_results.returncode=0 WHEN 1 THEN 0 END) FROM run_results) as number_of_green_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("hijh5tcy")

		// remove
		collection.Schema.RemoveField("kfzcfzes")

		// remove
		collection.Schema.RemoveField("qbwaa2rr")

		// remove
		collection.Schema.RemoveField("xiw49qxx")

		// add
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mavwotom",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_execution_time)
		collection.Schema.AddField(new_average_execution_time)

		// add
		new_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "bt2a5gsu",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_output_length)
		collection.Schema.AddField(new_average_output_length)

		// add
		new_number_of_distinct_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "gr2dgbwn",
			"name": "number_of_distinct_runs",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_number_of_distinct_runs)
		collection.Schema.AddField(new_number_of_distinct_runs)

		// add
		new_number_of_green_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "4azemfcx",
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
			"query": "SELECT\n    run_results.workspace AS id,\n    AVG(run_results.execution_time) AS average_execution_time,\n    AVG(LENGTH(run_results.output)) AS average_output_length,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    SUM(CASE run_results.returncode=0 WHEN 1 THEN 0 END) as number_of_green_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "hijh5tcy",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_execution_time)
		collection.Schema.AddField(del_average_execution_time)

		// add
		del_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kfzcfzes",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qbwaa2rr",
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
			"id": "xiw49qxx",
			"name": "number_of_green_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_green_runs)
		collection.Schema.AddField(del_number_of_green_runs)

		// remove
		collection.Schema.RemoveField("mavwotom")

		// remove
		collection.Schema.RemoveField("bt2a5gsu")

		// remove
		collection.Schema.RemoveField("gr2dgbwn")

		// remove
		collection.Schema.RemoveField("4azemfcx")

		return dao.SaveCollection(collection)
	})
}
