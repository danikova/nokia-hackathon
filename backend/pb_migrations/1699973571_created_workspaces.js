/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "05r1y5kxur4fspq",
    "created": "2023-11-14 14:52:51.087Z",
    "updated": "2023-11-14 14:52:51.087Z",
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
        "presentable": false,
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
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vt8rjrd2",
        "name": "last_valid_sha",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_vwRkz06` ON `workspaces` (`user`)"
    ],
    "listRule": "@request.auth.id = user.id",
    "viewRule": "@request.auth.id = user.id",
    "createRule": null,
    "updateRule": "@request.auth.id = user.id",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("05r1y5kxur4fspq");

  return dao.deleteCollection(collection);
})
