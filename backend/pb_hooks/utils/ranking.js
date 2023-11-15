/// <reference path="../../pb_data/types.d.ts" />

/**
 * Get keys related to a task.
 * @param {string} taskName - The name of the task.
 * @returns {string[]} - An array of keys related to the task.
 */
function generateKeysForTask(taskName) {
  return [
    taskName + "-implementation",
    taskName + "-functionality",
    taskName + "-prettiness",
  ];
}

/**
 * Summarizes points on a ranking record.
 * @param {models.Record} record - The ranking record to summarize points on.
 */
function summarizePoints(record) {
  /** @type {{fetchRegisteredTasks: ()=>models.Record[]}} */
  const { fetchRegisteredTasks } = require(`${__hooks}/utils/task.js`);

  const registeredTasks = fetchRegisteredTasks();

  let finalSum = 0;
  const pointsSum = {};
  const points = JSON.parse(record.get("points") || "{}");

  for (const task of registeredTasks) {
    const taskName = task["task_name"];
    const rangeKeys = generateKeysForTask(taskName);

    let pointsSumCount = 0;
    pointsSum[taskName] = 0;
    for (const rangeKey of rangeKeys) {
      if (points[rangeKey]) {
        pointsSum[taskName] += points[rangeKey];
        pointsSumCount++;
      }
    }
    pointsSum[taskName] /= pointsSumCount;
    finalSum += pointsSum[taskName];
  }
  finalSum /= registeredTasks.length;

  pointsSumStr = JSON.stringify(pointsSum);
  record.set("points_sum", pointsSumStr);
  record.set("sum", finalSum);
}

module.exports = {
  summarizePoints,
};
