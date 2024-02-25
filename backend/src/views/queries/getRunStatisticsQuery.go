package queries

var GetRunStatisticsQuery = `
WITH RankedRunResults AS (
  SELECT
    *,
    DENSE_RANK() OVER (
      PARTITION BY workspace
      ORDER BY
        run_id DESC
    ) AS row_num
  FROM
    run_results
  ORDER BY
    created DESC
),
FilteredRunResults AS (
  SELECT
    *
  FROM
    RankedRunResults
  WHERE
    row_num <= 2
),
SuccessfulTasks AS (
  SELECT
    workspace,
    COUNT(id) AS number_of_successful_tasks
  FROM
    run_results
  WHERE
    status = 'success'
  GROUP BY
    workspace
),
FailureTasks AS (
  SELECT
    workspace,
    COUNT(id) AS number_of_failure_tasks
  FROM
    run_results
  WHERE
    status = 'fail'
  GROUP BY
    workspace
),
TimeoutTasks AS (
  SELECT
    workspace,
    COUNT(id) AS number_of_timeouted_tasks
  FROM
    run_results
  WHERE
    status = 'timeout'
  GROUP BY
    workspace
),
FlowFailureTasks AS (
  SELECT
    workspace,
    COUNT(id) AS number_of_flow_failure_tasks
  FROM
    run_results
  WHERE
    status = 'flowFail'
  GROUP BY
    workspace
),
RunCounts AS (
  SELECT
    workspace,
    COUNT(DISTINCT run_id) AS number_of_runs,
    COUNT(run_id) AS number_of_evaluated_tasks
  FROM
    run_results
  GROUP BY
    workspace
),
AggregatedResults AS (
  SELECT
    fr.workspace AS id,
    rc.number_of_runs AS number_of_runs,
    rc.number_of_evaluated_tasks AS number_of_evaluated_tasks,
    ROUND(AVG(LENGTH (fr.output))) AS average_output_length,
    AVG(
      CASE
        WHEN fr.status = 'success' THEN fr.execution_time
        ELSE NULL
      END
    ) AS average_execution_time,
    AVG(
      CASE
        WHEN fr.status = 'success'
        AND fr.output_similarity > 0.01 THEN fr.output_similarity
        ELSE NULL
      END
    ) AS average_output_similarity
  FROM
    FilteredRunResults fr
    JOIN RunCounts rc ON fr.workspace = rc.workspace
  GROUP BY
    fr.workspace
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
FROM
  AggregatedResults AS ar
  LEFT JOIN SuccessfulTasks AS st ON ar.id = st.workspace
  LEFT JOIN FailureTasks AS ft ON ar.id = ft.workspace
  LEFT JOIN TimeoutTasks AS tt ON ar.id = tt.workspace
  LEFT JOIN FlowFailureTasks AS fft ON ar.id = fft.workspace
WHERE
  ar.number_of_runs > 0
ORDER BY
  ar.average_output_similarity DESC,
  ar.average_execution_time;
`
