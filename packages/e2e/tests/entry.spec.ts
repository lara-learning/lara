import { test, expect, Page } from '@playwright/test'

const { USER_ID, URL, ENVIRONMENT_NAME } = process.env

const DEFAULT_ENVIRONMENT = 'development'
const envName = ENVIRONMENT_NAME ?? DEFAULT_ENVIRONMENT

const entryText = 'Harte Arbeit'
const updatedEntryText = 'Sehr Harte Arbeit'

const selectAll = async (page: Page) => {
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Meta+A')
}

test.describe('entry', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
    await page.goto(URL ?? '')
    await page.locator(`text=${envName}`).hover()
    await page.type('input', USER_ID ?? '')
    await page.locator('text=Dev Login').click()
  })

  test('create entry', async () => {
    await page.locator('text=Today').waitFor()
    await page.fill('textarea', entryText)
    await page.keyboard.press('Enter')
    await page.keyboard.type('1')
    await page.keyboard.press('Enter')
    await page.locator('text=Entry has been created').waitFor()
    const work = page.locator(`text=${entryText}`)
    expect(work).toBeDefined()
  })

  test('update entry', async () => {
    await page.locator(`text=${entryText}`).click()
    await selectAll(page)
    await page.keyboard.type(updatedEntryText)
    await page.keyboard.press('Enter')
    await selectAll(page)
    await page.keyboard.type('2')
    await page.keyboard.press('Enter')
    await page.locator('text=Entry has been changed').waitFor()
    const work = page.locator(updatedEntryText)
    expect(work).toBeDefined()
  })

  test('delete entry', async () => {
    await page.locator('button > i').click()
    await page.locator('text=Entry has been deleted').waitFor()
    const work = page.locator(updatedEntryText)
    expect(work).toBeUndefined()
  })
})
