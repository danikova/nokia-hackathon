package queries

var GetRunResultsSumQuery = `
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
`
