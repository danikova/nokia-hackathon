/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "qr2hsj0yuzgy8xg",
    "created": "2023-11-14 14:52:51.100Z",
    "updated": "2023-11-14 14:52:51.100Z",
    "name": "workspace_rankings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "v1o3m8nh",
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
        "id": "jq00ajqu",
        "name": "rankings",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "1db9ij2e0hxoe4h",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.role = 'staff'",
    "viewRule": "@request.auth.role = 'staff'",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qr2hsj0yuzgy8xg");

  return dao.deleteCollection(collection);
})
