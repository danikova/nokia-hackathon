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
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode = 124 AND rr.workspace = r.workspace) as number_of_timeouted_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) as number_of_successful_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_something_changed_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("mntxf2pa")

		// remove
		collection.Schema.RemoveField("kyl2238z")

		// remove
		collection.Schema.RemoveField("sf2lpr6h")

		// remove
		collection.Schema.RemoveField("x7eu07rh")

		// remove
		collection.Schema.RemoveField("ovs0expb")

		// remove
		collection.Schema.RemoveField("snozngqo")

		// add
		new_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "kwntswyo",
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
			"id": "5zlegzax",
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
			"id": "9f5p7jch",
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
			"id": "nwvbi0le",
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
			"id": "mrooropv",
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
			"id": "c4rwwpps",
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
			"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode = 124 AND rr.workspace = r.workspace) as number_of_timeouted_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) as number_of_successful_runs,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_something_changed_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    AVG(LENGTH(r.output)) AS average_output_length\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY average_execution_time"
		}`), &options)
		collection.SetOptions(options)

		// add
		del_number_of_runs := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mntxf2pa",
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
			"id": "kyl2238z",
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
			"id": "sf2lpr6h",
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
			"id": "x7eu07rh",
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
			"id": "ovs0expb",
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
			"id": "snozngqo",
			"name": "average_output_length",
			"type": "json",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_average_output_length)
		collection.Schema.AddField(del_average_output_length)

		// remove
		collection.Schema.RemoveField("kwntswyo")

		// remove
		collection.Schema.RemoveField("5zlegzax")

		// remove
		collection.Schema.RemoveField("9f5p7jch")

		// remove
		collection.Schema.RemoveField("nwvbi0le")

		// remove
		collection.Schema.RemoveField("mrooropv")

		// remove
		collection.Schema.RemoveField("c4rwwpps")

		return dao.SaveCollection(collection)
	})
}
