/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "13y8gd3twwabrdl",
    "created": "2023-11-14 14:52:51.105Z",
    "updated": "2023-11-14 14:52:51.105Z",
    "name": "run_tasks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ax18uqod",
        "name": "task_name",
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
        "id": "pefiyrrh",
        "name": "etalon_result",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "wnlb6bbe",
        "name": "score_multipler",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("13y8gd3twwabrdl");

  return dao.deleteCollection(collection);
})
