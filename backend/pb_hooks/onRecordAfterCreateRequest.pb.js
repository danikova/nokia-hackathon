/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateRequest((e) => {
  const { generateUserWorkspace } = require(`${__hooks}/utils/workspace.js`);
  generateUserWorkspace(e.record.id);
}, "users");
