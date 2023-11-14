/// <reference path="../../pb_data/types.d.ts" />

function createWorkspaceForUser(userId) {
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
  createWorkspaceForUser,
};
