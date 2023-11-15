/// <reference path="../pb_data/types.d.ts" />

cronAdd("workspaceEventsCleanup", "*/5 * * * *", () => {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const records = $app
    .dao()
    .findRecordsByExpr(
      tableNames.workspaceEvents,
      $dbx.exp("new_run_started  <> '' AND new_run_started IS NOT NULL")
    );

  console.log("workspaceEventsCleanup", records.length);
  const now = new Date();
  for (const record of records) {
    if (record) {
      const new_run_started = record.getDateTime("new_run_started");
      const diff = now.getTime() - new_run_started.getTime();
      const diffInMinutes = diff / (1000 * 60);
      if (diffInMinutes > 5) {
        record.set("new_run_started", null);
        $app.dao().saveRecord(record);
      }
    }
  }
});

routerAdd(
  "GET",
  "/*",
  $apis.staticDirectoryHandler(`${__hooks}/../pb_public/`, false)
);

// import all additional view files
require(`${__hooks}/views/runResultsSum.js`);
require(`${__hooks}/views/runStatistics.js`);
require(`${__hooks}/views/githubBotStarted.js`);
require(`${__hooks}/views/githubBotFinished.js`);
