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

module.exports = {
  generateUserWorkspace,
};
