/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeAuthWithOAuth2Request((e) => {
  const { getGlobalByKey } = require(`${__hooks}/utils/globalVariables.js`);
  const { canUserLogin } = require(`${__hooks}/utils/whiteList.js`);

  const disabledLogin = getGlobalByKey("disabled_login");
  if (/true/i.test(disabledLogin)) {
    throw new UnauthorizedError("Login is disabled");
  }

  if (!canUserLogin(e.oAuth2User.username, e.oAuth2User.email)) {
    throw new UnauthorizedError("User is not on the whitelist");
  }
});
