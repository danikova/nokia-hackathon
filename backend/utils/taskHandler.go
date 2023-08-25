package utils

import (
	"github.com/pocketbase/pocketbase"
)

type Task struct {
	Name         string `db:"task_name" json:"task_name"`
	EtalonResult string `db:"etalon_result" json:"etalon_result"`
}

func GetRegisteredTasks(app *pocketbase.PocketBase) []Task {
	tasks := []Task{}

	err := app.Dao().DB().
		NewQuery("SELECT task_name, etalon_result FROM run_tasks LIMIT 100").
		All(&tasks)

	if err != nil {
		return []Task{}
	}
	return tasks
}
