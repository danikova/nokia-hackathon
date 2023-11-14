/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ctkeqt5lzu9o6s1",
    "created": "2023-11-14 14:52:51.099Z",
    "updated": "2023-11-14 14:52:51.099Z",
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
        "id": "4fkiq9pq",
        "name": "email",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ctkeqt5lzu9o6s1");

  return dao.deleteCollection(collection);
})
