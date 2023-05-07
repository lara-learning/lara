import { Handler } from 'aws-lambda'
import { SES } from 'aws-sdk'
import { mkdirSync, writeFileSync } from 'fs'
import { compile } from 'handlebars'
import { createTransport } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'
import { MailOptions } from 'nodemailer/lib/ses-transport'
import { resolve } from 'path'

import { EmailPayload } from '@lara/api'

import { generateEmailTemplate } from './mail-template'
import { getAttachements } from './s3'

const { IS_OFFLINE, SES_EMAIL, SES_REGION } = process.env

if (!SES_EMAIL) {
  throw new Error("Missing Environment Variable: 'SES_EMAIL'")
}

if (!SES_REGION) {
  throw new Error("Missing Environment Variable: 'SES_REGION'")
}

const transporter = createTransport({
  SES: new SES({ region: SES_REGION }),
})

type Response = 'success' | 'error'

const handleGettingAttachements = async (payload: EmailPayload): Promise<Attachment[]> => {
  if (payload.emailType !== 'reportExport' && payload.emailType !== 'paperBriefing') {
    return []
  }

  const filename = payload.attachments[0].filename

  const attachement = await getAttachements(filename)

  if (!attachement) {
    return []
  }
  return [{ filename, content: attachement }]
}

export const handler: Handler<EmailPayload, Response> = async (payload) => {
  const { emailType, translations, userData } = payload

  // generate correct email html with placeholders for personal data
  const htmlTemplate = generateEmailTemplate(emailType, translations)

  // prepare html for handlebars templating
  const htmlHandlebarsTemplate = compile(htmlTemplate)

  // insert personal data into handlebars template
  const html = htmlHandlebarsTemplate(userData)

  const attachments = await handleGettingAttachements(payload)

  const emailPayload: MailOptions = {
    from: { name: 'Lara Bot', address: SES_EMAIL },
    to: userData.receiverEmail,
    attachments,
    subject: translations.subject[emailType],
    html,
  }

  if (IS_OFFLINE) {
    // saves generated html to email packege
    mkdirSync(resolve(__dirname, '../tmp'), { recursive: true })
    writeFileSync(resolve(__dirname, '../tmp/testHtml.html'), html)
    attachments?.forEach(
      (att) => att.content && writeFileSync(resolve(__dirname, `../tmp/${att.filename}`), att.content as Buffer)
    )

    console.log(
      '--------------------------\n' +
        `Sending Email to receiver: ${userData.receiverEmail}\n\n` +
        `emailType: ${emailType}\n\n` +
        //  `html: ${html}\n\n` +
        `attachement: ${attachments?.map((att) => att.filename).toString()}\n` +
        '---------------------------'
    )

    return 'success'
  }

  return transporter
    .sendMail(emailPayload)
    .then((): Response => 'success')
    .catch((e): Response => {
      console.error('Email not send: ', e)

      return 'error'
    })
}
