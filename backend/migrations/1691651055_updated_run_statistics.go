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
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.is_success=FALSE GROUP BY run_results.run_id) as number_of_something_changed_runs,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    AVG(LENGTH(run_results.output)) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("y3yu76df")

		// remove
		collection.Schema.RemoveField("wbqy6xqs")

		// remove
		collection.Schema.RemoveField("b5g7uaeh")

		// remove
		collection.Schema.RemoveField("wligury6")

		// remove
		collection.Schema.RemoveField("natihewe")

		// remove
		collection.Schema.RemoveField("ymrfb5ut")

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "cg2pdquo",
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
		new_number_of_timeouted_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "l6wlubse",
			"name": "number_of_timeouted_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_timeouted_runs)
		collection.Schema.AddField(new_number_of_timeouted_runs)

		// add
		new_number_of_successful_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "xxqncomw",
			"name": "number_of_successful_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_successful_runs)
		collection.Schema.AddField(new_number_of_successful_runs)

		// add
		new_number_of_something_changed_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "eimpdine",
			"name": "number_of_something_changed_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_something_changed_runs)
		collection.Schema.AddField(new_number_of_something_changed_runs)

		// add
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "avykvty1",
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
			"id": "0bybfqxl",
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
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.is_success=FALSE GROUP BY run_results.run_id) as number_of_something_changed_runs,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    AVG(LENGTH(run_results.output)) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "y3yu76df",
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
		del_number_of_timeouted_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wbqy6xqs",
			"name": "number_of_timeouted_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_timeouted_runs)
		collection.Schema.AddField(del_number_of_timeouted_runs)

		// add
		del_number_of_successful_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "b5g7uaeh",
			"name": "number_of_successful_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_successful_runs)
		collection.Schema.AddField(del_number_of_successful_runs)

		// add
		del_number_of_something_changed_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wligury6",
			"name": "number_of_something_changed_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_something_changed_runs)
		collection.Schema.AddField(del_number_of_something_changed_runs)

		// add
		del_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "natihewe",
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
			"id": "ymrfb5ut",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// remove
		collection.Schema.RemoveField("cg2pdquo")

		// remove
		collection.Schema.RemoveField("l6wlubse")

		// remove
		collection.Schema.RemoveField("xxqncomw")

		// remove
		collection.Schema.RemoveField("eimpdine")

		// remove
		collection.Schema.RemoveField("avykvty1")

		// remove
		collection.Schema.RemoveField("0bybfqxl")

		return dao.SaveCollection(collection)
	})
}
