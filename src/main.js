const core = require('@actions/core')
const gh = require('@actions/github')

async function run() {
  try {
    console.log(`Getting data from action`)
    const token = core.getInput('token')
    const title = core.getInput('title')
    const body = core.getInput('body')
    const assignees = core.getInput('assignees')

    console.log(`Authenticating with token`)
    const octokit = await gh.getOctokit(token)

    const { owner, repo } = gh.context.repo
    console.log(`Opening issue for ${repo} by ${owner}`)

    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      assignees: assignees ? assignees.split('\n') : undefined
    })

    console.log(`Issue opened for by ${owner}`)
    core.setOutput('issue', response.data)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
