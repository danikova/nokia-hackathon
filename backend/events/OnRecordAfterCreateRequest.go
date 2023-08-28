package events

import (
	"encoding/json"
	"hackathon-backend/utils"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

var UsersCollectionName = "users"
var RankingsCollectionName = "rankings"
var WorkspacesCollectionName = "workspaces"
var WorkspaceEventsCollectionName = "workspace_events"
var WorkspaceRankingsCollectionName = "workspace_rankings"

var UserFieldKey = "user"
var WorkspaceFieldKey = "workspace"
var RankingsFieldKey = "rankings"

func OnRecordAfterCreateRequest(app *pocketbase.PocketBase) {
	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name == UsersCollectionName {
			CreateWorkspaceForUser(app, &e.Record.Id)
		}
		if e.Record.Collection().Name == RankingsCollectionName {
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

	app.Dao().SaveRecord(record)
}

func CreateWorkspaceForUser(app *pocketbase.PocketBase, userId *string) error {
	workspaces, err := app.Dao().FindCollectionByNameOrId(WorkspacesCollectionName)
	if err != nil {
		return err
	}

	workspace_events, err := app.Dao().FindCollectionByNameOrId(WorkspaceEventsCollectionName)
	if err != nil {
		return err
	}

	workspace_rankings, err := app.Dao().FindCollectionByNameOrId(WorkspaceRankingsCollectionName)
	if err != nil {
		return err
	}

	workspaceRecord := models.NewRecord(workspaces)
	workspaceRecord.Set(UserFieldKey, userId)
	app.Dao().SaveRecord(workspaceRecord)

	workspaceEventRecord := models.NewRecord(workspace_events)
	workspaceEventRecord.Set(WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceEventRecord)

	workspaceRankingRecord := models.NewRecord(workspace_rankings)
	workspaceRankingRecord.Set(WorkspaceFieldKey, workspaceRecord.Id)
	app.Dao().SaveRecord(workspaceRankingRecord)

	log.Println("new workspace", workspaceRecord.Id, "generated for user", userId)
	log.Println("new workspace event", workspaceEventRecord.Id, "generated for workspace", workspaceRecord)
	return nil
}
