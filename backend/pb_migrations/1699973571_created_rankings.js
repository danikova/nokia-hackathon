/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1db9ij2e0hxoe4h",
    "created": "2023-11-14 14:52:51.105Z",
    "updated": "2023-11-14 14:52:51.105Z",
    "name": "rankings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g8aguwv2",
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
        "id": "tbyjgrc5",
        "name": "workspace",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "05r1y5kxur4fspq",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "hgwkngrs",
        "name": "points",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "9mv4wdwv",
        "name": "points_sum",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "hjgyerya",
        "name": "sum",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "lzcedor2",
        "name": "comments",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_ILYubYt` ON `rankings` (\n  `user`,\n  `workspace`\n)"
    ],
    "listRule": "@request.auth.role = 'staff'",
    "viewRule": "@request.auth.role = 'staff'",
    "createRule": "@request.auth.role = 'staff' && @request.auth.id = user.id",
    "updateRule": "@request.auth.role = 'staff' && @request.auth.id = user.id",
    "deleteRule": "@request.auth.role = 'staff' && @request.auth.id = user.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1db9ij2e0hxoe4h");

  return dao.deleteCollection(collection);
})
