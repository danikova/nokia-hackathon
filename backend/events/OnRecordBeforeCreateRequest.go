package events

import (
	"encoding/json"
	"hackathon-backend/utils"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func OnRecordBeforeCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == RankingsCollectionName {
			enforceReadonlyFieldsByUser(app, e.Record, []string{"user", "workspace", "points", "comments"})
			SummarizePointsOnRanking(app, e.Record)
		}
		return nil
	})
}

func getKeysFromTask(task *utils.Task) []string {
	return []string{
		task.Name + "-implementation",
		task.Name + "-functionality",
		task.Name + "-prettiness",
	}
}

func SummarizePointsOnRanking(app *pocketbase.PocketBase, record *models.Record) {
	tasks := utils.GetRegisteredTasks(app)
	points := map[string]int16{}
	pointsSum := map[string]float64{}
	record.UnmarshalJSONField("points", &points)

	finalSum := 0.0
	for _, task := range tasks {
		rangeKeys := getKeysFromTask(&task)
		for _, rangeKey := range rangeKeys {
			pointsSum[task.Name] += float64(points[rangeKey])
		}
		pointsSum[task.Name] /= float64(len(rangeKeys))
		finalSum += pointsSum[task.Name]
	}
	finalSum /= float64(len(tasks))

	pointsSumStr, _ := json.Marshal(pointsSum)
	record.Set("points_sum", pointsSumStr)
	record.Set("sum", finalSum)
}
