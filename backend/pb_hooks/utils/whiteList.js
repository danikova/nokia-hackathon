/// <reference path="../../pb_data/types.d.ts" />

function canUserLogin(username, email) {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);

  let expressions = [];
  if (username !== "") {
    expressions.push($dbx.hashExp({ username: username }));
  }
  if (email !== "") {
    expressions.push($dbx.hashExp({ email: email }));
  }

  try {
    const records = $app
      .dao()
      .findRecordsByExpr(tableNames.userWhitelist, $dbx.or(...expressions));
    if (records.length === 0) return false;
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  canUserLogin,
};
