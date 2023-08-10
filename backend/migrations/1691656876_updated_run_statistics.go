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
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length,\n    COUNT(r.run_id) AS number_of_evaluated_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = TRUE AND rr.workspace = r.workspace) as number_of_successful_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_failure_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode != 0 AND rr.workspace = r.workspace) as number_of_timeouted_tasks\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY number_of_runs, average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("r6vupyz4")

		// remove
		collection.Schema.RemoveField("2akmjwif")

		// remove
		collection.Schema.RemoveField("0zld2xap")

		// remove
		collection.Schema.RemoveField("pbxtjga8")

		// remove
		collection.Schema.RemoveField("txn9tg2n")

		// remove
		collection.Schema.RemoveField("3px1c4lc")

		// remove
		collection.Schema.RemoveField("3v1zw45b")

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1xsdmohl",
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
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "5xobbdqz",
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
			"id": "5t36bpiv",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_average_output_length)
		collection.Schema.AddField(new_average_output_length)

		// add
		new_number_of_evaluated_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "fjdeiglg",
			"name": "number_of_evaluated_tasks",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_number_of_evaluated_tasks)
		collection.Schema.AddField(new_number_of_evaluated_tasks)

		// add
		new_number_of_successful_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ivp9hzlo",
			"name": "number_of_successful_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_successful_tasks)
		collection.Schema.AddField(new_number_of_successful_tasks)

		// add
		new_number_of_failure_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "1fawv0yo",
			"name": "number_of_failure_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_failure_tasks)
		collection.Schema.AddField(new_number_of_failure_tasks)

		// add
		new_number_of_timeouted_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "yygt2jm4",
			"name": "number_of_timeouted_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_number_of_timeouted_tasks)
		collection.Schema.AddField(new_number_of_timeouted_tasks)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("t78tnkzbxipdjl9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		json.Unmarshal([]byte(`{
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length,\n    COUNT(r.run_id) AS number_of_evaluated_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = TRUE AND rr.workspace = r.workspace) as number_of_successful_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_failure_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode != 0 AND rr.workspace = r.workspace) as number_of_timeouted_tasks\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "r6vupyz4",
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
			"id": "2akmjwif",
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
			"id": "0zld2xap",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// add
		del_number_of_evaluated_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "pbxtjga8",
			"name": "number_of_evaluated_tasks",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), del_number_of_evaluated_tasks)
		collection.Schema.AddField(del_number_of_evaluated_tasks)

		// add
		del_number_of_successful_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "txn9tg2n",
			"name": "number_of_successful_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_successful_tasks)
		collection.Schema.AddField(del_number_of_successful_tasks)

		// add
		del_number_of_failure_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3px1c4lc",
			"name": "number_of_failure_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_failure_tasks)
		collection.Schema.AddField(del_number_of_failure_tasks)

		// add
		del_number_of_timeouted_tasks := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "3v1zw45b",
			"name": "number_of_timeouted_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_timeouted_tasks)
		collection.Schema.AddField(del_number_of_timeouted_tasks)

		// remove
		collection.Schema.RemoveField("1xsdmohl")

		// remove
		collection.Schema.RemoveField("5xobbdqz")

		// remove
		collection.Schema.RemoveField("5t36bpiv")

		// remove
		collection.Schema.RemoveField("fjdeiglg")

		// remove
		collection.Schema.RemoveField("ivp9hzlo")

		// remove
		collection.Schema.RemoveField("1fawv0yo")

		// remove
		collection.Schema.RemoveField("yygt2jm4")

		return dao.SaveCollection(collection)
	})
}
