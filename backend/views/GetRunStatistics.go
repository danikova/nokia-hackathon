package views

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type AggregatedResults struct {
	ID                       string  `json:"id" db:"id"`
	NumberOfRuns             int     `json:"number_of_runs" db:"number_of_runs"`
	AverageExecutionTime     float64 `json:"average_execution_time" db:"average_execution_time"`
	AverageOutputLength      int     `json:"average_output_length" db:"average_output_length"`
	AverageOutputSimilarity  float64 `json:"average_output_similarity" db:"average_output_similarity"`
	NumberOfEvaluatedTasks   int     `json:"number_of_evaluated_tasks" db:"number_of_evaluated_tasks"`
	NumberOfSuccessfulTasks  int     `json:"number_of_successful_tasks" db:"number_of_successful_tasks"`
	NumberOfFailureTasks     int     `json:"number_of_failure_tasks" db:"number_of_failure_tasks"`
	NumberOfTimeoutedTasks   int     `json:"number_of_timeouted_tasks" db:"number_of_timeouted_tasks"`
	NumberOfFlowFailureTasks int     `json:"number_of_flow_failure_tasks" db:"number_of_flow_failure_tasks"`
}

var runStatisticsQuery = minifyQueryStr(`
WITH SuccessfulTasks AS (
	SELECT workspace, COUNT(id) AS number_of_successful_tasks
	FROM run_results
	WHERE status = 'success'
	GROUP BY workspace
),
FailureTasks AS (
	SELECT workspace, COUNT(id) AS number_of_failure_tasks
	FROM run_results
	WHERE status = 'fail'
	GROUP BY workspace
),
TimeoutTasks AS (
	SELECT workspace, COUNT(id) AS number_of_timeouted_tasks
	FROM run_results
	WHERE status = 'timeout'
	GROUP BY workspace
),
FlowFailureTasks AS (
	SELECT workspace, COUNT(id) AS number_of_flow_failure_tasks
	FROM run_results
	WHERE status = 'flowFail'
	GROUP BY workspace
),
AggregatedResults AS (
	SELECT
			r.workspace AS id,
			COUNT(DISTINCT r.run_id) AS number_of_runs,
			AVG(CASE WHEN r.status = 'success' THEN r.execution_time ELSE NULL END) AS average_execution_time,
			ROUND(AVG(LENGTH(r.output))) AS average_output_length,
			AVG(CASE WHEN r.status = 'success' AND r.output_similarity > 0.01 THEN r.output_similarity ELSE NULL END) AS average_output_similarity,
			COUNT(r.run_id) AS number_of_evaluated_tasks
	FROM run_results AS r
	GROUP BY r.workspace
)
SELECT
	ar.id AS id,
	COALESCE(ar.number_of_runs, 0) AS number_of_runs,
	COALESCE(ar.average_execution_time, 0.0) AS average_execution_time,
	COALESCE(ar.average_output_length, 0) AS average_output_length,
	COALESCE(ar.average_output_similarity, 0.0) AS average_output_similarity,
	COALESCE(ar.number_of_evaluated_tasks, 0) AS number_of_evaluated_tasks,
	COALESCE(st.number_of_successful_tasks, 0) AS number_of_successful_tasks,
	COALESCE(ft.number_of_failure_tasks, 0) AS number_of_failure_tasks,
	COALESCE(tt.number_of_timeouted_tasks, 0) AS number_of_timeouted_tasks,
	COALESCE(fft.number_of_flow_failure_tasks, 0) AS number_of_flow_failure_tasks
FROM AggregatedResults AS ar
LEFT JOIN SuccessfulTasks AS st ON ar.id = st.workspace
LEFT JOIN FailureTasks AS ft ON ar.id = ft.workspace
LEFT JOIN TimeoutTasks AS tt ON ar.id = tt.workspace
LEFT JOIN FlowFailureTasks AS fft ON ar.id = fft.workspace
WHERE ar.number_of_runs > 0
ORDER BY ar.average_output_similarity DESC, ar.average_execution_time
`)

func AddGetRunStatisticsView(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/run_statistics/",
		Handler: func(c echo.Context) error {

			results := []AggregatedResults{}
			err := app.Dao().DB().
				NewQuery(runStatisticsQuery).
				All(&results)

			if err != nil {
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
