/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeCreateRequest((e) => {
  const { restoreReadonlyFields } = require(`${__hooks}/utils/helpers.js`);
  const { summarizePoints } = require(`${__hooks}/utils/ranking.js`);
  restoreReadonlyFields(e.record, ["user", "workspace", "points", "comments"]);
  summarizePoints(e.record);
}, "rankings");
