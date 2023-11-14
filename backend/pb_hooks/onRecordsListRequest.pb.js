/// <reference path="../pb_data/types.d.ts" />

onRecordsListRequest((e) => {
  const info = $apis.requestInfo(e.httpContext);
  if (!info.admin) {
    for (const record of e.records) {
      record.set("etalon_result", ":(");
    }
  }
}, "run_tasks");

onRecordsListRequest((e) => {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const query = $apis.requestInfo(e.httpContext).query;
  const expandList = (query["expand"] || "").split(",").map((s) => s.trim());

  for (const record of e.records) {
    const workspaceId = record.getString("workspace");
    if (workspaceId !== "") {
      const expandMap = {};
      const rankings = $app
        .dao()
        .findRecordsByExpr(
          tableNames.rankings,
          $dbx.hashExp({ workspace: workspaceId })
        );
      const rankingIds = rankings.map((ranking) => ranking.id);
      if (expandList.includes("workspace")) {
        try {
          const workspace = $app
            .dao()
            .findRecordById(tableNames.workspace, workspaceId);
          expandMap["workspace"] = workspace;
        } catch (e) {}
      }
      if (expandList.includes("rankings")) {
        expandMap["rankings"] = rankings;
      }
      record.setExpand(expandMap);
      record.set("rankings", rankingIds);
    }
  }
}, "workspace_rankings");
