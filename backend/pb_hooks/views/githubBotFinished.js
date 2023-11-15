/// <reference path="../../pb_data/types.d.ts" />

/**
 * Represents the meta information for a task in JavaScript.
 * @typedef {Object} TaskMeta
 * @property {string} repository - The repository.
 * @property {string} run_id - The run ID.
 * @property {string} sha - The SHA value.
 */

/**
 * Represents a task in JavaScript.
 * @typedef {Object} Task
 * @property {string} output - The output.
 * @property {string} stderr - The standard error.
 * @property {string} returncode - The return code.
 * @property {string} execution_time - The execution time.
 */

/**
 * Represents the data structure of the request from github
 * @typedef {Object} GithubBody
 * @property {TaskMeta} meta - The meta information.
 * @property {Task[]} tasks - An array of tasks.
 */

/**
 * Checks and handles run results for a given run ID.
 * @param {string} runId - The run ID to check.
 * @throws {BadRequestError} - If the run ID is already registered and marked as successful.
 */
function checkRunResults(runId) {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const records = $app
    .dao()
    .findRecordsByExpr(
      tableNames.runResults,
      $dbx.hashExp({ run_id: reqBody.Meta.RunId })
    );
  for (const record of records) {
    if (record) {
      if (record.getBool("is_success")) {
        throw new BadRequestError(
          `This run_id (${runId}) is already registered`
        );
      }
      $app.dao().deleteRecord(record);
    }
  }
}

/**
 * Updates a workspace with a new SHA.
 * @param {models.Record} workspace - The workspace record to update.
 * @param {string} sha - The SHA to set in the workspace.
 * @throws {BadRequestError} - If the event is already over or the end date is not set.
 */
function updateWorkspaceWithSha(workspace, sha) {
  const { getGlobalByKey } = require(`${__hooks}/utils/globalVariables.js`);
  const end_date_value = getGlobalByKey("event_end_date_time");

  if (!end_date_value) throw new BadRequestError("Event end date not set");

  const now = new Date();
  const end_date = new Date(end_date_value);

  if (now > end_date) {
    throw new BadRequestError("Event is already over");
  }

  workspace.set("last_valid_sha", sha);
  $app.dao().saveRecord(workspace);
}

/**
 * @param {GithubBody} data
 */
function evalGithubBody(data) {
  /** @type {{fetchRegisteredTasks: ()=>models.Record[]}} */
  const { fetchRegisteredTasks } = require(`${__hooks}/utils/task.js`);
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const { jaccardSimilarity } = require(`${__hooks}/utils/similarity.js`);
  const { readFile } = require(`${__hooks}/utils/helpers.js`);

  const runResultCollection = $app
    .dao()
    .findCollectionByNameOrId(tableNames.runResults);
  const registeredTasks = fetchRegisteredTasks();
  const registeredTaskResults = {};
  for (const task of registeredTasks) {
    const filePath = `${task.collection().baseFilesPath()}/${
      task.id
    }/${task.get("etalon_result")}`;
    registeredTaskResults[task.get("task_name")] = readFile(filePath);
  }

  for (const taskKey in data.tasks) {
    const task = data.tasks[taskKey];
    if (
      registeredTasks.filter((t) => t.get("task_name") === taskKey).length === 0
    )
      continue;

    let status = "success";
    if (task.returncode === 124) {
      status = "timeout";
    } else if (task.stderr !== "") {
      status = "fail";
    }

    const trimmedOutput = task.output.trim();
    const trimmedEtalonOutput = registeredTaskResults[taskKey].trim();
    const output_similarity = jaccardSimilarity(
      trimmedOutput,
      trimmedEtalonOutput,
      3
    );

    const record = new Record(runResultCollection);
    const form = new RecordUpsertForm($app, record);
    form.loadData({
      workspace: workspace.id,
      run_id: data.meta.run_id,
      task: taskKey,
      execution_time: task.execution_time,
      output_similarity: output_similarity,
      status: status,
      output: task.output,
      stderr: task.stderr,
      returncode: task.returncode,
      is_success: true,
      sha: data.meta.sha,
    });
    form.submit();
  }
}

routerAdd(
  "POST",
  "/github-bot-finished",
  (c) => {
    const {
      findWorkspaceByRepository,
      findWorkspaceEventByWorkspace,
    } = require(`${__hooks}/utils/workspace.js`);
    const {
      validateRunId,
      checkGithubFolderContent,
    } = require(`${__hooks}/utils/github.js`);

    /** @type {GithubBody} */
    const data = $apis.requestInfo(c).data;

    checkRunResults(data.meta.run_id);
    validateRunId(data.meta.repository, data.meta.run_id);

    /** @type {models.Record} */
    const workspace = findWorkspaceByRepository(data.meta.repository);
    updateWorkspaceWithSha(workspace, data.meta.sha);

    checkGithubFolderContent(data.meta.repository);

    evalGithubBody(data);

    const workspace_event = findWorkspaceEventByWorkspace(workspace);
    workspace_event.set("new_run_started", null);
    $app.dao().saveRecord(workspace_event);

    broadcastAny("run_statistics/*", {
      action: "create",
      record: null,
    });

    return c.json(201, {
      code: 201,
      message: "workflow event registered",
    });
  },
  $apis.activityLogger($app),
  $apis.requireGuestOnly()
);
