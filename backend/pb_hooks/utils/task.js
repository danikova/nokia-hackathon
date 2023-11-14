/// <reference path="../../pb_data/types.d.ts" />

/**
 * Fetches and returns registered tasks from the database.
 * @returns {DynamicModel[]} - An array of registered task objects.
 */
function fetchRegisteredTasks() {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);

  const result = arrayOf(
    new DynamicModel({
      id: "",
      task_name: "",
      etalon_result: "",
    })
  );

  $app
    .dao()
    .db()
    .newQuery(`SELECT id, task_name, etalon_result FROM ${tableNames.runTasks}`)
    .all(result);

  return result;
}

module.exports = {
  fetchRegisteredTasks,
};
