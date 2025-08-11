import { test, expect, Page } from '@playwright/test'

let { USER_ID, URL } = process.env

USER_ID ??= '123'
URL ??= 'http://localhost:8080'

async function goto(page: Page, path: string = '') {
  await page.goto(`${URL}${path}`)
  const statusBar = page.locator('#status-bar')
  await statusBar.waitFor({ timeout: 10000 })
  await statusBar.hover()

  const input = page.locator('#dev-login-user-id')
  await expect(input).toBeVisible()
  await input.fill(USER_ID ?? '')

  const loginButton = page.locator('#dev-login-button')
  await expect(loginButton).toBeVisible()
  await loginButton.click()
}

test.describe('entry', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('switch language', async () => {
    goto(page, '/settings')

    const dropdown = page.locator('#settings-language-select')
    await expect(dropdown).toBeVisible()

    const currentValue = await dropdown.inputValue()
    const labelText = currentValue === 'de' ? 'Sprache' : 'Language'

    const label = page.locator(`label:has-text("${labelText}")`)
    await expect(label).toBeVisible()

    const newValue = currentValue === 'de' ? 'en' : 'de'
    await dropdown.selectOption({ value: newValue })
    await expect(dropdown).toHaveValue(newValue)

    const translatedText = newValue === 'de' ? 'Sprache' : 'Language'
    const newLabel = page.locator(`label:has-text("${translatedText}")`)
    await expect(newLabel).toBeVisible()
  })
})
