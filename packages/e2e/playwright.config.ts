// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test'
const { BASICAUTHENTICATION_USERNAME, BASICAUTHENTICATION_PASSWORD } = process.env

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: 0,
  outputDir: 'test-results',
  use: {
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        httpCredentials: {
          username: BASICAUTHENTICATION_USERNAME ? BASICAUTHENTICATION_USERNAME : '',
          password: BASICAUTHENTICATION_PASSWORD ? BASICAUTHENTICATION_PASSWORD : '',
        },
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
}
export default config
