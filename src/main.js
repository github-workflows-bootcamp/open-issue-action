const { Octokit } = require('@octokit/core')
const core = require('@actions/core')
const gh = require('@actions/github')

// Create an issue in the repository
// https://docs.github.com/pt/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
async function run() {
  try {
    console.log(`Getting data from action`)
    const token = core.getInput('token')
    const title = core.getInput('title')
    const body = core.getInput('body')
    const assignees = core.getInput('assignees')
    const labels = core.getInput('labels')

    const { owner, repo } = gh.context.repo
    const payload = {
      owner,
      repo,
      title,
      body,
      labels: labels ? labels.split('\n') : undefined,
      assignees: assignees ? assignees.split('\n') : undefined,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }

    console.log(`Authenticating with token ${token}`)
    const octokit = new Octokit({ auth: token })
    const response = await octokit.request(
      `POST /repos/${owner}/${repo}/issues`,
      payload
    )

    console.log(`Issue opened for by ${owner}`)
    core.setOutput('issue', { ok: 'true' })
  } catch (error) {
    console.log(error)
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
