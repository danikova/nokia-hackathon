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
			"query": "SELECT\n    run_results.workspace AS id,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n  (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n  (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.is_success=FALSE GROUP BY run_results.run_id) as number_of_something_changed_runs,\n    AVG(LENGTH(run_results.output)) AS average_output_length,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("wqka1yqw")

		// remove
		collection.Schema.RemoveField("jf4cqqcu")

		// remove
		collection.Schema.RemoveField("ganqe74q")

		// remove
		collection.Schema.RemoveField("6unhphqv")

		// remove
		collection.Schema.RemoveField("dryyzhi5")

		// add
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "srisgujo",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_execution_time)
		collection.Schema.AddField(new_average_execution_time)

		// add
		new_number_of_timeouted_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "hsehjlnz",
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
			"id": "phz9768c",
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
			"id": "srk7texq",
			"name": "number_of_something_changed_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_something_changed_runs)
		collection.Schema.AddField(new_number_of_something_changed_runs)

		// add
		new_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "pnlqfskk",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_output_length)
		collection.Schema.AddField(new_average_output_length)

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "e5vikuod",
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

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT\n    run_results.workspace AS id,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n  (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n    AVG(LENGTH(run_results.output)) AS average_output_length,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "wqka1yqw",
			"name": "average_execution_time",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_execution_time)
		collection.Schema.AddField(del_average_execution_time)

		// add
		del_number_of_timeouted_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "jf4cqqcu",
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
			"id": "ganqe74q",
			"name": "number_of_successful_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_successful_runs)
		collection.Schema.AddField(del_number_of_successful_runs)

		// add
		del_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "6unhphqv",
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
			"id": "dryyzhi5",
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

		// remove
		collection.Schema.RemoveField("srisgujo")

		// remove
		collection.Schema.RemoveField("hsehjlnz")

		// remove
		collection.Schema.RemoveField("phz9768c")

		// remove
		collection.Schema.RemoveField("srk7texq")

		// remove
		collection.Schema.RemoveField("pnlqfskk")

		// remove
		collection.Schema.RemoveField("e5vikuod")

		return dao.SaveCollection(collection)
	})
}
