/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeAuthWithPasswordRequest((e) => {
  const { getGlobalByKey } = require(`${__hooks}/utils/globalVariables.js`);
  const { isUserAllowedToLogin } = require(`${__hooks}/utils/whiteList.js`);

  const disabledLogin = getGlobalByKey("disabled_login");
  if (/true/i.test(disabledLogin)) {
    throw new UnauthorizedError("Login is disabled");
  }

  if (!isUserAllowedToLogin(e.identity, e.identity)) {
    throw new UnauthorizedError("User is not on the whitelist");
  }
});
