const core = require('@actions/core')
const gh = require('@actions/github')

async function run() {
  try {
    console.log(`Getting data from action`)
    const token = core.getInput('token')
    const title = core.getInput('title')
    const body = core.getInput('body')
    const assignees = core.getInput('assignees')

    console.log(`Authenticating with token ${token}`)
    const octokit = gh.getOctokit(token)

    const { owner, repo } = gh.context.repo
    const payload = {
      owner,
      repo,
      title,
      body,
      assignees: assignees ? assignees.split('\n') : undefined
    }

    console.log(
      `Opening issue for ${repo} by ${owner} with data ${JSON.stringify(payload, null, 2)}`
    )

    const response = await octokit.rest.issues.create({
      ...payload,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github.v3+json'
      }
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
