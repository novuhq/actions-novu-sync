import * as core from '@actions/core'
import axios from 'axios'
import { createHmac } from 'crypto'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const bridgeUrl: string = core.getInput('bridge-url')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Bridge URL ${bridgeUrl} ...`)

    const inputs = {
      novuApiKey: core.getInput('novu-api-key'),
      bridgeUrl: core.getInput('bridge-url'),
      apiUrl: core.getInput('api-url')
    }

    const response = await syncState(
      inputs.bridgeUrl,
      inputs.novuApiKey,
      inputs.apiUrl
    )

    // Set outputs for other workflow steps to use
    core.setOutput('result', response)
    core.setOutput('success', true)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export async function syncState(
  bridgeUrl: string,
  novuApiKey: string,
  apiUrl: string
): Promise<object> {
  const timestamp = Date.now()
  const discover = await axios.get(`${bridgeUrl}?action=discover`, {
    headers: {
      'x-novu-signature': `t=${timestamp},v1=${createHmac('sha256', novuApiKey)
        .update(`${timestamp}.${JSON.stringify({})}`)
        .digest('hex')}`
    }
  })

  const sync = await axios.post(
    `${apiUrl}/v1/bridge/sync?source=githubAction`,
    {
      bridgeUrl,
      workflows: discover.data.workflows
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `ApiKey ${novuApiKey}`
      }
    }
  )

  return sync.data
}
