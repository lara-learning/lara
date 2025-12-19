import { Lambda } from '@aws-sdk/client-lambda'
import AdmZip from 'adm-zip'
import { Handler } from 'aws-lambda'
import { launch, Browser, Page } from 'puppeteer-core'

import { EmailPayload, PrintData, PrintPaperData, PrintPayload, PrintReportData } from '@lara/api'
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

export const handler: Handler<PrintPayload, { success: 'error' | 'success'; filename: string | undefined }> = async (
  payload
): Promise<{ success: 'error' | 'success'; filename: string | undefined }> => {
  if (!payload || !payload.printDataHash) {
    return { success: 'error', filename: undefined }
  }

  const exportData = await getExport(payload.printDataHash)

  if (!exportData || exportData.data.length === 0) {
    return { success: 'error', filename: undefined }
  }

  const { data, userData, printTranslations, emailTranslations } = exportData

  const isSingleExport = data.length === 1

  let filename = ''
  let isPaper = false

  if (isSingleExport) {
    isPaper = data[0].filename.includes('Paper')
    if (isPaper) {
      const emailType = 'paperBriefing'
      console.log(emailType)
      filename = (data[0] as PrintPaperData).filename
    } else {
      filename = (data[0] as PrintReportData).filename
    }
  } else {
    filename = `batch-export-${payload.printDataHash}.zip`
  }
  let browser: Browser | undefined
  try {
    if (payload.action === 'pageLoad') {
      console.log('Sending Trainee Email')
      const traineeEmailPayload: EmailPayload = {
        emailType: 'reportExport',
        attachments: [{ filename: '' }],
        userData: {
          receiverEmail: userData.receiverEmail,
          receiverName: userData.firstName,
          buttonLink: `${FRONTEND_URL}/archive`,
        },
        translations: emailTranslations,
      }

      await lambda.invoke({
        FunctionName: EMAIL_FUNCTION,
        InvocationType: 'Event',
        Payload: JSON.stringify(traineeEmailPayload),
      })

      if (payload.mentorEmail && payload.mentorName) {
        console.log('mentor email')
        const mentorEmailPayload: EmailPayload = {
          emailType: 'reportExport',
          attachments: [{ filename: '' }],
          userData: {
            receiverEmail: payload.mentorEmail,
            receiverName: payload.mentorName,
            buttonLink: `${FRONTEND_URL}/archive`,
          },
          translations: emailTranslations,
        }

        console.log('Sending mentor email')
        await lambda.invoke({
          FunctionName: EMAIL_FUNCTION,
          InvocationType: 'Event',
          Payload: JSON.stringify(mentorEmailPayload),
        })
      }

      return { success: 'success', filename }
    }

    browser = await launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      acceptInsecureCerts: true,
    })

    const page = await browser.newPage()
    await new Promise((res) => setTimeout(res, 300))
    await page.createCDPSession()

    let outputFile: Buffer | undefined

    if (isSingleExport) {
      if (isPaper) {
        const [paperData] = data as PrintPaperData[]
        outputFile = await createPaperPDF(paperData, userData, printTranslations, page)
      } else {
        const [reportData] = data as PrintReportData[]
        outputFile = await createPDF(reportData, userData, printTranslations, page)
      }
    } else {
      outputFile = await generateBatch(exportData, page)
    }

    if (!outputFile) throw new Error('"generatedReport" is undefined')
    await saveAttachments(filename, outputFile)

    return { success: 'success', filename }
  } catch (e) {
    console.error('Error while processing request:', e)
    await lambda.invoke({
      FunctionName: EMAIL_FUNCTION,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        emailType: 'error',
        userData,
        translations: emailTranslations,
      }),
    })

    return { success: 'error', filename }
  } finally {
    await browser?.close()
  }
}
