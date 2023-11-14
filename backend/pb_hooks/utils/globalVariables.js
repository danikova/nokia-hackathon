/// <reference path="../../pb_data/types.d.ts" />

const globals = {
  primary_project: "",
  disabled_login: "",
  event_end_date_time: "",
};

/**
 * Type definition for the getGlobalByKey function.
 * @param {string} key - The key to search for in the globals.
 * @returns {string | null} - The value associated with the key, or null if not found.
 */
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
