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

/**
 * Reads the content of a file from the specified path.
 * @param {string} filePath - The path to the file.
 * @returns {string} - The content of the file as a string.
 */
function readFile(filePath) {
  const raw = $os.readFile(filePath);
  return String.fromCharCode(...raw);
}

/**
 * @typedef {Object} Client
 * @property {(string) => void} send - Sends a message to the client.
 * @property {(string) => boolean} hasSubscription - Checks if the client has a specific subscription.
 */

/**
 * Broadcasts an event with data to clients subscribed to the event.
 * @param {string} eventName - The name of the event to broadcast.
 * @param {unknown} data - The data to broadcast with the event.
 */
function broadcastAny(eventName, data) {
  /** @type {Client[]} */
  const clients = $app.subscriptionsBroker().clients();
  const encodedData = JSON.stringify(data);

  console.log(JSON.stringify(clients, null, 2));

  const msg = {
    name: eventName,
    data: encodedData,
  };

  for (const client of clients) {
    if (!client.HasSubscription(eventName)) continue;
    client.send(msg);
  }

  return nil;
}

module.exports = {
  restoreReadonlyFields,
  readFile,
  broadcastAny,
};
