import { Lambda } from 'aws-sdk'
import AdmZip from 'adm-zip'
import { Handler } from 'aws-lambda'
import chromium from 'chrome-aws-lambda'
import { Browser, Page } from 'puppeteer-core'

import { EmailPayload, PrintData, PrintPayload } from '@lara/api'

import { createPDF } from './create-pdf'
import { getExport, saveAttachments } from './s3'

const { IS_OFFLINE, EMAIL_FUNCTION, FRONTEND_URL } = process.env

if (!EMAIL_FUNCTION) {
  throw new Error("Missing env Var: 'EMAIL_FUNCTION'")
}

const lambda = new Lambda({
  region: 'eu-central-1',
  endpoint: IS_OFFLINE ? 'http://localhost:3002' : undefined,
})

const generateBatch = async ({ userData, reportsData, printTranslations }: PrintData, page: Page): Promise<Buffer> => {
  const zip = new AdmZip()

  for (let index = 0; index < reportsData.length; index++) {
    const reportData = reportsData[index]

    const buffer = await createPDF(reportData, userData, printTranslations, page)

    if (buffer) {
      zip.addFile(reportData.filename, buffer)
    }
  }

  return zip.toBuffer()
}

export const handler: Handler<PrintPayload, 'success' | 'error'> = async (payload) => {
  if (!payload || !payload.printDataHash) {
    return 'error'
  }

  const exportData = await getExport(payload.printDataHash)

  if (!exportData || exportData.reportsData.length === 0) {
    return 'error'
  }

  let browser: Browser | undefined
  const { reportsData, userData, printTranslations, emailTranslations } = exportData

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: IS_OFFLINE ? true : chromium.headless,
      ignoreHTTPSErrors: true,
    })

    // create empty browser page
    const page = await browser.newPage()

    const isSingleExport = reportsData.length === 1

    let outputFile: Buffer | undefined
    let filename = ''

    if (isSingleExport) {
      const [data] = reportsData

      outputFile = await createPDF(data, userData, printTranslations, page)
      filename = data.filename
    } else {
      outputFile = await generateBatch(exportData, page)
      filename = `batch-export-${new Date().getTime()}.zip`
    }

    if (!outputFile) {
      throw new Error('"generatedReport" is undefind')
    }

    await saveAttachments(filename, outputFile)

    const emailPayload: EmailPayload = {
      emailType: 'reportExport',
      attachments: [{ filename }],
      userData: {
        receiverEmail: userData.receiverEmail,
        receiverName: userData.firstName,
        buttonLink: `${FRONTEND_URL}/archive`,
      },
      translations: emailTranslations,
    }

    await lambda
      .invoke({
        FunctionName: EMAIL_FUNCTION,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(emailPayload),
      })
      .promise()

    return 'success'
  } catch (e) {
    console.error('Error while rendering PDF: ', e)

    await lambda
      .invoke({
        FunctionName: EMAIL_FUNCTION,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          emailType: 'error',
          userData,
          translations: emailTranslations,
        }),
      })
      .promise()

    return 'error'
  } finally {
    await browser?.close()
  }
}
