/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "fjen3yrbdowd2lh",
    "created": "2023-11-14 14:52:51.088Z",
    "updated": "2023-11-14 14:52:51.088Z",
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
        "id": "bq5jva1c",
        "name": "value",
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
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("fjen3yrbdowd2lh");

  return dao.deleteCollection(collection);
})
