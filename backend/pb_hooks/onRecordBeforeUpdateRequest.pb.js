/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeUpdateRequest((e) => {
  const { restoreReadonlyFields } = require(`${__hooks}/utils/helpers.js`);
  restoreReadonlyFields(e.record, ["repo_url"]);
}, "workspaces");

onRecordBeforeUpdateRequest((e) => {
  const { restoreReadonlyFields } = require(`${__hooks}/utils/helpers.js`);
  const { summarizePoints } = require(`${__hooks}/utils/ranking.js`);
  restoreReadonlyFields(e.record, ["points", "comments"]);
  summarizePoints(e.record);
}, "rankings");
