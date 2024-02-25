package utils

import (
	"fmt"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func ContainsWithLambda[T any](s []T, fn func(value T) bool) *T {
	for _, v := range s {
		if fn(v) {
			return &v
		}
	}

	return nil
}

func Min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func Map[T, U any](ts []T, f func(T) U) []U {
	us := make([]U, len(ts))
	for i := range ts {
		us[i] = f(ts[i])
	}
	return us
}

func GetCollections(app *pocketbase.PocketBase, collectionNames []string) (map[string]*models.Collection, error) {
	collectionsMap := make(map[string]*models.Collection)

	for _, collectionName := range collectionNames {
			collection, err := app.Dao().FindCollectionByNameOrId(collectionName)
			if err != nil {
					return nil, fmt.Errorf("could not find collection %s: %w", collectionName, err)
			}
			collectionsMap[collectionName] = collection
	}

	return collectionsMap, nil
}