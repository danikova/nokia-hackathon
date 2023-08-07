package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("u71l7zif871cq02")
		if err != nil {
			return err
		}

		collection.CreateRule = nil

		collection.UpdateRule = nil

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("u71l7zif871cq02")
		if err != nil {
			return err
		}

		collection.CreateRule = types.Pointer("@request.auth.role = 'staff'")

		collection.UpdateRule = types.Pointer("@request.auth.role = 'staff'")

		return dao.SaveCollection(collection)
	})
}
