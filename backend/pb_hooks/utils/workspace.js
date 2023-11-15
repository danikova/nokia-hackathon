/// <reference path="../../pb_data/types.d.ts" />

/**
 * Generates and initializes a new workspace for the specified user.
 * @param {string} userId - The user ID for whom the workspace is created.
 */
function generateUserWorkspace(userId) {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  try {
    const workspaces = $app
      .dao()
      .findCollectionByNameOrId(tableNames.workspaces);
    const workspaceEvents = $app
      .dao()
      .findCollectionByNameOrId(tableNames.workspaceEvents);
    const workspaceRankings = $app
      .dao()
      .findCollectionByNameOrId(tableNames.workspaceRankings);

    const workspaceRecord = new Record(workspaces, {
      user: userId,
    });
    $app.dao().saveRecord(workspaceRecord);

    const workspaceEventRecord = new Record(workspaceEvents, {
      workspace: workspaceRecord.id,
    });
    const workspaceRankingRecord = new Record(workspaceRankings, {
      workspace: workspaceRecord.id,
    });
    $app.dao().saveRecord(workspaceEventRecord);
    $app.dao().saveRecord(workspaceRankingRecord);

    console.log(
      `New workspace ${workspaceRecord.id} generated for user ${userId}`
    );
    console.log(
      `Other records generated: ${workspaceEventRecord.id}, ${workspaceRankingRecord.id}`
    );
  } catch (e) {}
}

/**
 * Retrieves a workspace record by repository name.
 * @param {string} repositoryName - The name of the repository.
 * @returns {models.Record} - The workspace record associated with the repository.
 * @throws {BadRequestError} - If the repository is not connected to any workspace.
 */
function findWorkspaceByRepository(repositoryName) {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const repoUrl = `https://github.com/${repositoryName}`;

  let workspace = new Record();
  try {
    workspace = $app
      .dao()
      .findFirstRecordByData(tableNames.workspace, "repo_url", repoUrl);
  } catch {
    throw new BadRequestError(
      `This repository (${repositoryName}) is not connected with any workspace`
    );
  }

  return workspace;
}

/**
 * Retrieves a workspace event record by workspace.
 * @param {models.Record} workspace - The workspace record.
 * @returns {models.Record} - The workspace event record associated with the workspace.
 * @throws {BadRequestError} - If the workspace event is not found for the given workspace.
 */
function findWorkspaceEventByWorkspace(workspace) {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);

  let workspaceEvent = new Record();
  try {
    workspaceEvent = $app
      .dao()
      .findFirstRecordByData(
        tableNames.workspaceEvents,
        "workspace",
        workspace.id
      );
  } catch {
    throw new BadRequestError(
      `Workspace event not found, with workspace id (${workspace.id})`
    );
  }

  return workspaceEvent;
}

module.exports = {
  generateUserWorkspace,
  findWorkspaceByRepository,
  findWorkspaceEventByWorkspace,
};
