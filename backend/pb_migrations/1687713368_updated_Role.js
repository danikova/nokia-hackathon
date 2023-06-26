migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9yp4vlud36r1pwb")

  collection.name = "roles"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9yp4vlud36r1pwb")

  collection.name = "Role"

  return dao.saveCollection(collection)
})
