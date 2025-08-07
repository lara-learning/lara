/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const dotenv = require('dotenv')

const { ENABLE_FRONTEND_TUNNEL, ENABLE_BACKEND_TUNNEL, STAGE } = process.env

/**
 * Open a tunnel to backend and frontend
 * and inject the urls into the env variables.
 */
const openTunnels = async () => {
  let tunnelUrls = {}

  if (ENABLE_FRONTEND_TUNNEL !== 'true' && ENABLE_BACKEND_TUNNEL !== 'true') {
    return tunnelUrls
  }

  let ngrok
  try {
    ngrok = require('ngrok')
  } catch (err) {
    console.error('ngrok is not installed. Run "yarn add ngrok --no-save" in your project directory and try again.')
    return tunnelUrls
  }

  if (ngrok && ENABLE_FRONTEND_TUNNEL === 'true') {
    tunnelUrls.FRONTEND_TUNNEL_URL = await ngrok.connect({ addr: 8080, host_header: 'localhost:8080' })
    console.info(`Frontend tunnel on URL: ${tunnelUrls.FRONTEND_TUNNEL_URL}`)
  }

  if (ngrok && ENABLE_BACKEND_TUNNEL === 'true') {
    tunnelUrls.BACKEND_TUNNEL_URL = (await ngrok.connect(3000)) + `/${STAGE ?? 'dev'}`
    console.info(`Backend tunnel on URL: ${tunnelUrls.BACKEND_TUNNEL_URL}`)
  }

  return tunnelUrls
}

/**
 * Resolves the env variables from the process. This is used if the build
 * is running in our CI pipelines. For local development serverless will
 * load the variables automatically from the .env file.
 * @returns Variables object
 */
module.exports = async () => {
  // Get keys from the example file
  const exampleVars = dotenv.config({ path: '.env.example' }).parsed
  const requiredKeys = Object.keys(exampleVars)

  /**
   * Map the keys to values from process.env.
   * The values are injected by GitLab into the runners
   */
  const envVars = requiredKeys.reduce((acc, varName) => {
    const value = process.env[varName]

    /**
     * We warn here and don't throw an Error because non mandatory
     * Variables like 'DEBUG' would cause the process to fail otherwise
     */
    if (!value || value === exampleVars[varName]) {
      console.warn(`Loading default value for environment variable: '${varName}'`)
    }

    return { ...acc, [varName]: value }
  }, {})

  const tunnels = await openTunnels()

  return {
    ...envVars,
    ...tunnels,
  }
}
