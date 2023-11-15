/// <reference path="../../pb_data/types.d.ts" />

routerAdd(
  "GET",
  "/run-statistics",
  (c) => {
    const { readFile } = require(`${__hooks}/utils/helpers.js`);
    const { cleanAndTrimQuery } = require(`${__hooks}/views/utils.js`);

    const sql = cleanAndTrimQuery(
      readFile(`${__hooks}/views/queries/runStatistics.sql`)
    );

    const aggregatedResult = arrayOf(
      new DynamicModel({
        id: "",
        number_of_runs: 0,
        average_execution_time: 0,
        average_output_length: 0,
        average_output_similarity: 0,
        number_of_evaluated_tasks: 0,
        number_of_successful_tasks: 0,
        number_of_failure_tasks: 0,
        number_of_timeouted_tasks: 0,
        number_of_flow_failure_tasks: 0,
      })
    );

    try {
      $app.dao().db().newQuery(sql).all(aggregatedResult);
    } catch {
      throw new BadRequestError("No run statistics found");
    }

    return c.json(201, aggregatedResult);
  },
  $apis.activityLogger($app),
  $apis.requireRecordAuth()
);
