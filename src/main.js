const { Octokit } = require('@octokit/core')
const core = require('@actions/core')
const gh = require('@actions/github')

async function run() {
  try {
    console.log(`Getting data from action`)
    const token = core.getInput('token')
    const title = core.getInput('title')
    const body = core.getInput('body')
    const assignees = core.getInput('assignees')

    const { owner, repo } = gh.context.repo
    const payload = {
      owner,
      repo,
      title,
      body,
      assignees: assignees ? assignees.split('\n') : undefined,
      labels: ['bug'],
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }

    console.log(`Authenticating with token ${token}`)
    const octokit = new Octokit({ auth: token })
    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/issues',
      payload
    )

    console.log(`Issue opened for by ${owner}`)
    core.setOutput('issue', response.data)
  } catch (error) {
    console.log(error)
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
