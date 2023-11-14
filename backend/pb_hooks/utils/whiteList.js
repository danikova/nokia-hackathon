/// <reference path="../../pb_data/types.d.ts" />

/**
 * Checks if a user with the given username or email is allowed to log in.
 * @param {string} username - The username to check.
 * @param {string} email - The email to check.
 * @returns {boolean} - True if the user is allowed to log in, false otherwise.
 */
function isUserAllowedToLogin(username, email) {
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
  isUserAllowedToLogin,
};
