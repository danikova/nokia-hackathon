/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "u71l7zif871cq02",
    "created": "2023-11-14 14:52:51.099Z",
    "updated": "2023-11-14 14:52:51.099Z",
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
        "presentable": false,
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
        "id": "rnvf3x5n",
        "name": "right_image",
        "type": "file",
        "required": false,
        "presentable": false,
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("u71l7zif871cq02");

  return dao.deleteCollection(collection);
})
