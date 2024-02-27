package views

import (
	"hackathon-backend/src/views/queries"
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

var runStatisticsQuery = minifyQueryStr(queries.GetRunStatisticsQuery)

func AddGetRunStatisticsView(app *pocketbase.PocketBase, e *core.ServeEvent) {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/custom_api/run_statistics/",
		Handler: func(c echo.Context) error {

			results := []AggregatedResults{}
			if app.Dao().DB().
				NewQuery(runStatisticsQuery).
				All(&results) != nil {
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
