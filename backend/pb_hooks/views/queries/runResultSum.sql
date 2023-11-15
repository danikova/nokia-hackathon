WITH RankedResults AS (
  SELECT
    rr.*,
    ws.repo_url,
    ROW_NUMBER() OVER (
      PARTITION BY rr.task
      ORDER BY
        rr.output_similarity DESC,
        rr.execution_time ASC
    ) AS row_num
  FROM
    run_results rr
    INNER JOIN workspaces ws ON rr.workspace = ws.id 
  WHERE
    -- do not add extra spaces/tabs to this expression
    ws.id = {:workspaceId}
)
SELECT
  *
FROM
  RankedResults
WHERE
  row_num = 1