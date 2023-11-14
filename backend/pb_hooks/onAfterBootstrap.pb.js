/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap((e) => {
  const tableNames = require(`${__hooks}/utils/tableNames.js`);
  const { globals } = require(`${__hooks}/utils/globalVariables.js`);

  if ($os.args.includes("migrate")) return true;

  try {
    const collection = $app.dao().findCollectionByNameOrId(tableNames.globals);
    for (const key in globals) {
      if (Object.hasOwnProperty.call(globals, key)) {
        const value = globals[key];

        try {
          $app.dao().findFirstRecordByData(tableNames.globals, "key", key);
        } catch (e) {
          const record = new Record(collection, {
            key: key,
            value: value,
          });
          $app.dao().saveRecord(record);
        }
      }
    }
  } catch (e) {
    throw new Error(
      `Table "${tableNames.globals}" not found. Please migrate first.`
    );
  }
});
