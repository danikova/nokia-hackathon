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
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.is_success=FALSE GROUP BY run_results.run_id) as number_of_something_changed_runs,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    AVG(LENGTH(run_results.output)) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("ya962vgj")

		// remove
		collection.Schema.RemoveField("43bo7ix2")

		// remove
		collection.Schema.RemoveField("psfgdidj")

		// remove
		collection.Schema.RemoveField("uvqlwswt")

		// remove
		collection.Schema.RemoveField("i0ymcnxn")

		// remove
		collection.Schema.RemoveField("umrvqjku")

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "9en0a1ac",
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
			"id": "e0hkdx5l",
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
			"id": "zfodukqu",
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
			"id": "xaqfcq2b",
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
			"id": "fqmdedly",
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
			"id": "nx19mirn",
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
			"query": "SELECT\n    run_results.workspace AS id,\n    COUNT(DISTINCT(run_results.run_id)) AS number_of_runs,\n    (SELECT AVG(run_results.execution_time) FROM run_results WHERE run_results.returncode = 0) AS average_execution_time,\n    (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 124) as number_of_timeouted_runs,\n  (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.returncode = 0 GROUP BY run_results.run_id) as number_of_successful_runs,\n  (SELECT COUNT(run_results.id) FROM run_results WHERE run_results.is_success=FALSE GROUP BY run_results.run_id) as number_of_something_changed_runs,\n    AVG(LENGTH(run_results.output)) AS average_output_length\nFROM run_results\nGROUP BY run_results.workspace"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ya962vgj",
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
		del_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "43bo7ix2",
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
			"id": "psfgdidj",
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
			"id": "uvqlwswt",
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
			"id": "i0ymcnxn",
			"name": "number_of_something_changed_runs",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_something_changed_runs)
		collection.Schema.AddField(del_number_of_something_changed_runs)

		// add
		del_average_output_length := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "umrvqjku",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// remove
		collection.Schema.RemoveField("9en0a1ac")

		// remove
		collection.Schema.RemoveField("e0hkdx5l")

		// remove
		collection.Schema.RemoveField("zfodukqu")

		// remove
		collection.Schema.RemoveField("xaqfcq2b")

		// remove
		collection.Schema.RemoveField("fqmdedly")

		// remove
		collection.Schema.RemoveField("nx19mirn")

		return dao.SaveCollection(collection)
	})
}
