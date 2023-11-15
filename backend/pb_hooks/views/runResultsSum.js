/// <reference path="../../pb_data/types.d.ts" />

routerAdd(
  "GET",
  "/run-result-sum",
  (c) => {
    const tableNames = require(`${__hooks}/utils/tableNames.js`);
    const { readFile } = require(`${__hooks}/utils/helpers.js`);
    const { cleanAndTrimQuery } = require(`${__hooks}/views/utils.js`);

    const info = $apis.requestInfo(c);
    const workspaceId = c.queryParam("workspaceId");

    if (workspaceId === "") {
      throw new BadRequestError(
        "Missing query param: 'workspaceId' is required"
      );
    }

    const expressions = [$dbx.hashExp({ id: workspaceId })];

    if (info.authRecord.get("role") !== "staff") {
      expressions.push($dbx.hashExp({ user: info.AuthRecord.Id }));
    }

    try {
      let workspace = new Record();
      $app
        .dao()
        .recordQuery(tableNames.workspaces)
        .andWhere($dbx.and(...expressions))
        .limit(1)
        .one(workspace);
    } catch {
      throw new BadRequestError("No workspace found");
    }

    const sql = cleanAndTrimQuery(
      readFile(`${__hooks}/views/queries/runResultSum.sql`)
    );

    const runResult = arrayOf(
      new DynamicModel({
        id: "",
        collectionId: "",
        collectionName: "",
        created: "",
        updated: "",
        workspace: "",
        run_id: "",
        task: "",
        execution_time: 0,
        output_similarity: 0,
        status: "",
        output: "",
        stderr: "",
        returncode: 0,
        is_success: false,
        sha: "",
      })
    );

    try {
      $app.dao().db().newQuery(sql).bind({ workspaceId }).all(runResult);
    } catch {
      throw new BadRequestError("No run results found");
    }

    return c.json(201, runResult);
  },
  $apis.activityLogger($app),
  $apis.requireRecordAuth()
);
