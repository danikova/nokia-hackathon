/**
 * Checks if a run ID is valid for a given repository.
 * @param {string} repositoryName - The name of the repository.
 * @param {string} runId - The run ID to check.
 * @throws {BadRequestError} - If the server can't access the details of the run.
 */
function validateRunId(repositoryName, runId) {
  const ghApiRunDetailsUrl = `https://api.github.com/repos/${repositoryName}/actions/runs/${runId}`;
  try {
    $http.send({
      url: ghApiRunDetailsUrl,
      method: "GET",
      headers: { "content-type": "application/json" },
    });
  } catch {
    throw new BadRequestError(
      `Server can't access the details of this run (${runId}) which belongs to (${repositoryName})`
    );
  }
}

function checkGithubFolderContent(repositoryName) {
  const { broadcastAny } = require(`${__hooks}/utils/helpers.js`);
  try {
  } catch (e) {
    const runResultCollection = $app
      .dao()
      .findCollectionByNameOrId(tableNames.runResults);
    const record = new Record(runResultCollection);
    const form = new RecordUpsertForm($app, record);
    form.loadData({
      workspace: workspace.id,
      run_id: data.meta.run_id,
      task: null,
      execution_time: null,
      output_similarity: null,
      status: "flowFail",
      output: "",
      stderr: err,
      returncode: null,
      is_success: false,
      sha: data.meta.sha,
    });
    form.submit();
    broadcastAny("run_statistics/*", {
      action: "create",
      record: null,
    });
    throw e;
  }
}

exports.module = {
  validateRunId,
  checkGithubFolderContent,
};
