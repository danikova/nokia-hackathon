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
		jsonData := `[
			{
				"id": "05r1y5kxur4fspq",
				"created": "2023-06-29 17:32:24.669Z",
				"updated": "2023-08-17 09:04:12.764Z",
				"name": "workspaces",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "hiulmth1",
						"name": "user",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "_pb_users_auth_",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": []
						}
					},
					{
						"system": false,
						"id": "0fucxzso",
						"name": "repo_url",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX ` + "`" + `idx_vwRkz06` + "`" + ` ON ` + "`" + `workspaces` + "`" + ` (` + "`" + `user` + "`" + `)"
				],
				"listRule": "@request.auth.id = user.id",
				"viewRule": "@request.auth.id = user.id",
				"createRule": null,
				"updateRule": "@request.auth.id = user.id",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "6ga4u2q0yqx7nfd",
				"created": "2023-07-01 10:44:11.181Z",
				"updated": "2023-08-10 20:54:45.836Z",
				"name": "run_results",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "lqq39msl",
						"name": "workspace",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "05r1y5kxur4fspq",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": []
						}
					},
					{
						"system": false,
						"id": "yhxkirja",
						"name": "run_id",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "wk6c4qa2",
						"name": "task",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ez7e9c7x",
						"name": "execution_time",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "femhxzh9",
						"name": "output",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "wq7ebzds",
						"name": "stderr",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "xetb5mty",
						"name": "returncode",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "xhckppnl",
						"name": "is_success",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [],
				"listRule": "@request.auth.id = workspace.user.id",
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "fjen3yrbdowd2lh",
				"created": "2023-07-04 20:07:39.455Z",
				"updated": "2023-08-10 20:54:45.836Z",
				"name": "globals",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "eowgx5d9",
						"name": "key",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "bq5jva1c",
						"name": "value",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [],
				"listRule": "",
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "ctkeqt5lzu9o6s1",
				"created": "2023-07-17 08:50:06.366Z",
				"updated": "2023-08-10 20:54:45.836Z",
				"name": "user_whitelist",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ifpwmley",
						"name": "username",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "4fkiq9pq",
						"name": "email",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "_pb_users_auth_",
				"created": "2023-07-19 06:53:39.345Z",
				"updated": "2023-08-10 20:54:45.836Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "users_name",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "ivsgnujo",
						"name": "role",
						"type": "select",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"user",
								"staff"
							]
						}
					},
					{
						"system": false,
						"id": "w9ms4jjt",
						"name": "avatarUrl",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [],
				"listRule": null,
				"viewRule": "id = @request.auth.id",
				"createRule": "",
				"updateRule": null,
				"deleteRule": null,
				"options": {
					"allowEmailAuth": true,
					"allowOAuth2Auth": true,
					"allowUsernameAuth": true,
					"exceptEmailDomains": null,
					"manageRule": null,
					"minPasswordLength": 8,
					"onlyEmailDomains": null,
					"requireEmail": false
				}
			},
			{
				"id": "u71l7zif871cq02",
				"created": "2023-08-07 13:49:12.662Z",
				"updated": "2023-08-10 20:54:45.836Z",
				"name": "info_cards",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "lqle4jml",
						"name": "left_image",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpeg",
								"image/png",
								"image/webp"
							],
							"thumbs": [],
							"protected": false
						}
					},
					{
						"system": false,
						"id": "vyqsuuhx",
						"name": "text",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "rnvf3x5n",
						"name": "right_image",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpeg",
								"image/png",
								"image/webp"
							],
							"thumbs": [],
							"protected": false
						}
					}
				],
				"indexes": [],
				"listRule": "",
				"viewRule": "",
				"createRule": null,
				"updateRule": "@request.auth.role = 'staff'",
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "t78tnkzbxipdjl9",
				"created": "2023-08-08 06:11:14.637Z",
				"updated": "2023-08-10 20:54:45.838Z",
				"name": "run_statistics",
				"type": "view",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "hzgqpkvd",
						"name": "number_of_runs",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "kizhperb",
						"name": "average_execution_time",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "zdsd6tkg",
						"name": "average_output_length",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "a6og3dft",
						"name": "number_of_evaluated_tasks",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "g1ylqobv",
						"name": "number_of_successful_tasks",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "0yrg2ocy",
						"name": "number_of_failure_tasks",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "wzrgzpfs",
						"name": "number_of_timeouted_tasks",
						"type": "json",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [],
				"listRule": "",
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {
					"query": "SELECT\n    r.workspace AS id,\n    COUNT(DISTINCT(r.run_id)) AS number_of_runs,\n    (SELECT AVG(rr.execution_time) FROM run_results AS rr WHERE rr.returncode = 0 AND rr.workspace = r.workspace) AS average_execution_time,\n    ROUND(AVG(LENGTH(r.output))) AS average_output_length,\n    COUNT(r.run_id) AS number_of_evaluated_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = TRUE AND rr.workspace = r.workspace) as number_of_successful_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.is_success = FALSE AND rr.workspace = r.workspace) as number_of_failure_tasks,\n    (SELECT COUNT(rr.id) FROM run_results AS rr WHERE rr.returncode != 0 AND rr.workspace = r.workspace) as number_of_timeouted_tasks\nFROM run_results AS r\nGROUP BY r.workspace\nORDER BY number_of_runs DESC, average_execution_time"
				}
			},
			{
				"id": "9t45swmvl66vb6m",
				"created": "2023-08-17 09:00:25.789Z",
				"updated": "2023-08-17 09:08:52.286Z",
				"name": "workspace_events",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "dn8zqgvq",
						"name": "workspace",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"collectionId": "05r1y5kxur4fspq",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": []
						}
					},
					{
						"system": false,
						"id": "jrns9iei",
						"name": "new_run_started",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					}
				],
				"indexes": [],
				"listRule": "@request.auth.id = workspace.user.id",
				"viewRule": "@request.auth.id = workspace.user.id",
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
