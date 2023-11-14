/// <reference path="../../pb_data/types.d.ts" />

const globals = {
  primary_project: "",
  disabled_login: "",
  event_end_date_time: "",
};

function getGlobalByKey(key) {
  try {
    const tableNames = require(`${__hooks}/utils/tableNames.js`);
    const record = $app
      .dao()
      .findFirstRecordByData(tableNames.globals, "key", key);
    return record.get("value");
  } catch (e) {
    return globals[key] || null;
  }
}

module.exports = {
  globals,
  getGlobalByKey,
};
