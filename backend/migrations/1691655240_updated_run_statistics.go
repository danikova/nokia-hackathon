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
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length,\n    COUNT(r.run_id) AS number_of_evaluated_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = TRUE AND rr.workspace = r.workspace) as number_of_successful_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_failure_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode != 0 AND rr.workspace = r.workspace) as number_of_timeouted_tasks\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("sbxogbp5")

		// remove
		collection.Schema.RemoveField("7zovrmcg")

		// remove
		collection.Schema.RemoveField("r895yzoa")

		// remove
		collection.Schema.RemoveField("ohycmcdm")

		// remove
		collection.Schema.RemoveField("s2jw7tfb")

		// remove
		collection.Schema.RemoveField("udjzm5ky")

		// remove
		collection.Schema.RemoveField("9jgmz0tj")

		// add
		new_number_of_runs := &schema.SchemaField{}
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
		}`), new_number_of_runs)
		collection.Schema.AddField(new_number_of_runs)

		// add
		new_average_execution_time := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "2akmjwif",
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
			"id": "0zld2xap",
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
			"id": "pbxtjga8",
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
			"id": "txn9tg2n",
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
			"id": "3px1c4lc",
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
			"id": "3v1zw45b",
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
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length,\n    COUNT(r.run_id) AS number_of_evaluated_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = TRUE AND rr.workspace = r.workspace GROUP BY rr.run_id) as number_of_successful_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_failure_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode != 0 AND rr.workspace = r.workspace) as number_of_timeouted_tasks\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "sbxogbp5",
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
			"id": "7zovrmcg",
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
			"id": "r895yzoa",
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
			"id": "ohycmcdm",
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
			"id": "s2jw7tfb",
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
			"id": "udjzm5ky",
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
			"id": "9jgmz0tj",
			"name": "number_of_timeouted_tasks",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_number_of_timeouted_tasks)
		collection.Schema.AddField(del_number_of_timeouted_tasks)

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

		return dao.SaveCollection(collection)
	})
}
