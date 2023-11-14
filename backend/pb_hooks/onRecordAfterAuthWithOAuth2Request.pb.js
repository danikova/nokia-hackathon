/// <reference path="../pb_data/types.d.ts" />

onRecordAfterAuthWithOAuth2Request((e) => {
  const { generateUserWorkspace } = require(`${__hooks}/utils/workspace.js`);
  generateUserWorkspace(e.record.id);

  if (e.oAuth2User.username !== "") {
    e.record.set("username", e.oAuth2User.username);
  }

  if (e.oAuth2User.name !== "") {
    e.record.set("name", e.oAuth2User.name);
  }

  if (e.oAuth2User.avatarUrl !== "") {
    e.record.set("avatarUrl", e.oAuth2User.avatarUrl);
  }

  try {
    $app.dao().saveRecord(e.record);
  } catch (e) {}
});
