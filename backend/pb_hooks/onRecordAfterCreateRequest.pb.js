/// <reference path="../pb_data/types.d.ts" />

const tableNames = require(`${__hooks}/utils/tableNames.js`);

onRecordAfterCreateRequest((e) => {
  const { createWorkspaceForUser } = require(`${__hooks}/utils/workspace.js`);
  createWorkspaceForUser(e.record.id);
}, tableNames.users);
