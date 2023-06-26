migrate((db) => {
  const collection = new Collection({
    "id": "9yp4vlud36r1pwb",
    "created": "2023-06-25 17:15:56.744Z",
    "updated": "2023-06-25 17:15:56.744Z",
    "name": "Role",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "opnw9zw2",
        "name": "title",
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
        "id": "trn7bihh",
        "name": "description",
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9yp4vlud36r1pwb");

  return dao.deleteCollection(collection);
})
