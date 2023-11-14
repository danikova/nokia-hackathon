/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9t45swmvl66vb6m",
    "created": "2023-11-14 14:52:51.100Z",
    "updated": "2023-11-14 14:52:51.100Z",
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
        "presentable": false,
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
        "presentable": false,
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9t45swmvl66vb6m");

  return dao.deleteCollection(collection);
})
