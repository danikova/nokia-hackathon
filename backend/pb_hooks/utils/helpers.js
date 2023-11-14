/// <reference path="../../pb_data/types.d.ts" />

/**
 * Restores readonly fields in a record based on editable field restrictions.
 * @param {models.Record} record - The record to enforce readonly fields on.
 * @param {string[]} editableFields - An array of editable field names.
 */
function restoreReadonlyFields(record, editableFields) {
  console.log(
    `Restoring read only fields on "${record.collection().name}" - "${
      record.id || "**new record without id**"
    }"`
  );

  let originalRecord = null;
  try {
    originalRecord = $app
      .dao()
      .findRecordById(record.collection().name, record.id);
  } catch (e) {}

  const getOriginalValue = (field) => {
    return originalRecord && originalRecord.get(field.name);
  };

  for (const field of record.collection().schema.fields()) {
    if (field && !editableFields.includes(field.name)) {
      record.set(field.name, getOriginalValue(field));
    }
  }
}

module.exports = {
  restoreReadonlyFields,
};
