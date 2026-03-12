const dotenv = require('dotenv')

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

  return {
    ...envVars,
  }
}
