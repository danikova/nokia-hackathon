package views

import (
	"log"
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type RunResult struct {
	ID               string  `db:"id" json:"id"`
	CollectionID     string  `db:"collectionId" json:"collectionId"`
	CollectionName   string  `db:"collectionName" json:"collectionName"`
	Created          string  `db:"created" json:"created"`
	Updated          string  `db:"updated" json:"updated"`
	Workspace        string  `db:"workspace" json:"workspace"`
	RunID            string  `db:"run_id" json:"run_id"`
	Task             string  `db:"task" json:"task"`
	ExecutionTime    float64 `db:"execution_time" json:"execution_time"`
	OutputSimilarity float64 `db:"output_similarity" json:"output_similarity"`
	Status           string  `db:"status" json:"status"`
	Output           string  `db:"output" json:"output"`
	Stderr           string  `db:"stderr" json:"stderr"`
	ReturnCode       int     `db:"returncode" json:"returncode"`
	IsSuccess        bool    `db:"is_success" json:"is_success"`
	Sha              string  `db:"sha" json:"sha"`
}

var runResultQuery = minifyQueryStr(`
WITH RankedResults AS (
	SELECT
			t1.*,
			ws.repo_url,
			ROW_NUMBER() OVER (PARTITION BY t1.task
												 ORDER BY t1.output_similarity DESC, t1.execution_time ASC) AS row_num
	FROM run_results t1
	INNER JOIN workspaces ws ON t1.workspace = ws.id
	WHERE ws.id = {:workspaceId}
)
SELECT *
FROM RankedResults
WHERE row_num = 1
`)

func AddGetRunResultsSumView(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/run_result_sum/",
		Handler: func(c echo.Context) error {
			info := apis.RequestData(c)
			workspaceId := strings.TrimSpace(c.QueryParam("workspaceId"))

			if workspaceId == "" {
				return echo.NewHTTPError(http.StatusBadRequest, "workspaceId is required")
			}

			expressions := []dbx.Expression{
				dbx.HashExp{"id": workspaceId},
			}
			if info.AuthRecord.Get("role") != "staff" {
				expressions = append(expressions, dbx.HashExp{"user": info.AuthRecord.Id})
			}

			workspaces, err := app.Dao().FindRecordsByExpr("workspaces",
				dbx.And(expressions[:]...),
			)

			if err != nil || len(workspaces) == 0 {
				return echo.NewHTTPError(http.StatusBadRequest, "No workspace found")
			}

			if workspaceId == "" || info.AuthRecord.Get("role") != "staff" {
				workspaceId = workspaces[0].Id
			}

			results := []RunResult{}
			err = app.Dao().DB().
				NewQuery(runResultQuery).
				Bind(dbx.Params{
					"workspaceId": workspaceId,
				}).
				All(&results)

			if err != nil || len(results) == 0 {
				log.Panic(err)
				return echo.NewHTTPError(http.StatusBadRequest, "Wrong query")
			}

			return c.JSON(http.StatusCreated, results)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			apis.RequireRecordAuth(),
		},
	})
}
