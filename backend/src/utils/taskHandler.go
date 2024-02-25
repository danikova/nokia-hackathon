package utils

import (
	"fmt"
	"io"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

var RunTasksCollectionName = "run_tasks"

type Task struct {
	Id                  string `db:"id" json:"id"`
	Name                string `db:"task_name" json:"task_name"`
	EtalonResultContent string
	EtalonResultPath    string `db:"etalon_result" json:"etalon_result"`
}

func GetRegisteredTasks(app *pocketbase.PocketBase, withFiles bool) []Task {
	tasks := []Task{}

	collection, _ := app.Dao().FindCollectionByNameOrId(RunTasksCollectionName)

	err := app.Dao().DB().
		NewQuery("SELECT id, task_name, etalon_result FROM run_tasks LIMIT 100").
		All(&tasks)

	fs, _ := app.NewFilesystem()
	defer fs.Close()

	if withFiles {
		for i := range tasks {
			task := &tasks[i]
			if task.EtalonResultPath != "" {
				content := getFileContent(task, collection, fs)
				task.EtalonResultContent = strings.TrimSpace(content)
			}
		}
	}

	if err != nil {
		return []Task{}
	}
	return tasks
}

func GetFsys(app *pocketbase.PocketBase) (*filesystem.System, error) {
	fsys, err := app.NewFilesystem()
	if err != nil {
		return nil, err
	}
	defer fsys.Close()

	return fsys, nil
}

func getFileContent(task *Task, collection *models.Collection, fs *filesystem.System) string {
	fileKey := collection.BaseFilesPath() + "/" + task.Id + "/" + task.EtalonResultPath
	f, err := fs.GetFile(fileKey)
	defer f.Close()
	content := ""

	if err == nil {
		buf := make([]byte, 32)
		for {
			n, err := f.Read(buf)
			fmt.Println(n, err, buf[:n])
			if err == io.EOF {
				break
			} else {
				content += string(buf[:n])
			}
		}
	}

	return content
}
