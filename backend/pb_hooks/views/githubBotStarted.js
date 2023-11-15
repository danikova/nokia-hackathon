/// <reference path="../../pb_data/types.d.ts" />

/**
 * Represents the meta information for a task in JavaScript.
 * @typedef {Object} TaskMeta
 * @property {string} repository - The repository.
 * @property {string} run_id - The run ID.
 * @property {string} sha - The SHA value.
 */

/**
 * Represents the data structure of the request from github
 * @typedef {Object} GithubBody
 * @property {TaskMeta} meta - The meta information.
 */

routerAdd(
  "POST",
  "/github-bot-started",
  (c) => {
    const {
      findWorkspaceByRepository,
      findWorkspaceEventByWorkspace,
    } = require(`${__hooks}/utils/workspace.js`);

    /** @type {GithubBody} */
    const data = $apis.requestInfo(c).data;
    const workspace = findWorkspaceByRepository(data.meta.repository);
    const workspace_event = findWorkspaceEventByWorkspace(workspace);

    workspace_event.set("new_run_started", new Date());
    $app.dao().saveRecord(workspace_event);

    return c.json(201, {
      code: 201,
      message: "workflow event registered",
    });
  },
  $apis.activityLogger($app),
  $apis.requireGuestOnly()
);
