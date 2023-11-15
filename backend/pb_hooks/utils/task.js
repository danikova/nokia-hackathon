/// <reference path="../../pb_data/types.d.ts" />

/**
 * Fetches and returns registered tasks from the database.
 * @returns {models.Record[]} - An array of registered task objects.
 */
function fetchRegisteredTasks() {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);

  const result = arrayOf(new Record());
  $app
    .dao()
    .recordQuery(tableNames.runTasks)
    .andSelect("id", "task_name", "etalon_result")
    .all(result);

  return result;
}

module.exports = {
  fetchRegisteredTasks,
};
