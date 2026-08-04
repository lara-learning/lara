import { Lambda } from '@aws-sdk/client-lambda'
import AdmZip from 'adm-zip'
import { Handler } from 'aws-lambda'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import chromium from '@sparticuz/chromium'
import { launch, Browser, Page } from 'puppeteer-core'

import { EmailPayload, EmailType, PrintData, PrintPaperData, PrintPayload, PrintReportData } from '@lara/api'

import { getExport, saveAttachments } from './s3'
import { createPaperPDF, createPDF } from './create-pdf'

const { IS_OFFLINE, EMAIL_FUNCTION, FRONTEND_URL } = process.env

if (!EMAIL_FUNCTION) {
  throw new Error("Missing env Var: 'EMAIL_FUNCTION'")
}

const lambda = new Lambda({
  region: 'eu-central-1',
  endpoint: IS_OFFLINE ? 'http://localhost:3002' : undefined,
})

/**
 * Launches Chromium with library paths required on Amazon Linux 2023 (Node.js 20/22).
 * @sparticuz/chromium extracts shared libs to /tmp/al2023/lib, but Puppeteer's child
 * process does not always inherit process.env.LD_LIBRARY_PATH without an explicit env.
 */
const launchBrowser = async (): Promise<Browser> => {
  const headlessMode: boolean | 'shell' = IS_OFFLINE ? true : 'shell'
  const executablePath = await chromium.executablePath()

  const libraryPaths = [join(tmpdir(), 'al2023', 'lib'), dirname(executablePath), process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(':')

  return launch({
    args: chromium.args,
    executablePath,
    headless: headlessMode,
    acceptInsecureCerts: true,
    env: {
      ...process.env,
      LD_LIBRARY_PATH: libraryPaths,
    },
  })
}

const generateBatch = async ({ userData, data, printTranslations }: PrintData, page: Page): Promise<Buffer> => {
  const zip = new AdmZip()

  for (let index = 0; index < data.length; index++) {
    const reportData = data[index] as PrintReportData

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

  if (!exportData || exportData.data.length === 0) {
    return 'error'
  }

  let browser: Browser | undefined
  const { data, userData, printTranslations, emailTranslations } = exportData

  try {
    browser = await launchBrowser()

    // create empty browser page
    const page = await browser.newPage()

    const isSingleExport = data.length === 1

    let outputFile: Buffer | undefined
    let filename = ''
    let emailType: EmailType = 'reportExport'
    let isPaper = false
    if (isSingleExport) {
      isPaper = data[0].filename.includes('Paper')
      if (isPaper) {
        const [paperData] = data as PrintPaperData[]
        emailType = 'paperBriefing'
        outputFile = await createPaperPDF(paperData, userData, printTranslations, page)
        filename = paperData.filename
      } else {
        const [reportData] = data as PrintReportData[]
        outputFile = await createPDF(reportData, userData, printTranslations, page)
        filename = reportData.filename
      }
    } else {
      outputFile = await generateBatch(exportData, page)
      filename = `batch-export-${new Date().getTime()}.zip`
    }

    if (!outputFile) {
      throw new Error('"generatedReport" is undefined')
    }

    await saveAttachments(filename, outputFile)

    if (isPaper) {
      if (userData.type == 'Trainee') {
        const emailTraineePayload: EmailPayload = {
          emailType: emailType,
          attachments: [{ filename }],
          userData: {
            receiverEmail: userData.receiverEmail,
            receiverName: userData.firstName,
            buttonLink: `${FRONTEND_URL}/archive`,
          },
          translations: emailTranslations,
        }
        await lambda.invoke({
          FunctionName: EMAIL_FUNCTION,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(emailTraineePayload),
        })
      } else {
        const emailMentorPayload: EmailPayload = {
          emailType: emailType,
          attachments: [{ filename }],
          userData: {
            receiverEmail: userData.receiverEmail,
            receiverName: userData.firstName,
            buttonLink: `${FRONTEND_URL}/archive`,
          },
          translations: emailTranslations,
        }
        await lambda.invoke({
          FunctionName: EMAIL_FUNCTION,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(emailMentorPayload),
        })
      }
    }

    const emailPayload: EmailPayload = {
      emailType,
      attachments: [{ filename }],
      userData: {
        receiverEmail: userData.receiverEmail,
        receiverName: userData.firstName,
        buttonLink: `${FRONTEND_URL}/archive`,
      },
      translations: emailTranslations,
    }

    await lambda.invoke({
      FunctionName: EMAIL_FUNCTION,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(emailPayload),
    })

    return 'success'
  } catch (e) {
    console.error('Error while rendering PDF: ', e)

    await lambda.invoke({
      FunctionName: EMAIL_FUNCTION,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        emailType: 'error',
        userData,
        translations: emailTranslations,
      }),
    })

    return 'error'
  } finally {
    await browser?.close()
  }
}
