import { EmailTranslations, EmailType } from '@lara/api'
import { readFileSync } from 'fs'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { resolve } from 'path'

const mjmlTemplate = readFileSync(resolve(__dirname, '../assets/index.mjml'), 'utf-8')

const createBase64UrlfromPng = (pngName: string) =>
  'data:image/png;base64,' + readFileSync(resolve(__dirname, '../assets/', pngName)).toString('base64')

const options = {
  keepComments: false,
}
const { html: compiledMjmlTemplate } = mjml2html(mjmlTemplate, options)

const emailHtmlHandlebars = compile(compiledMjmlTemplate)

export const generateEmailTemplate = (type: EmailType, translations: EmailTranslations): string => {
  const { headline, message, link } = translations

  let emailVariables = {
    DEFAULTBACKGROUND: createBase64UrlfromPng('background_0.png'),
    GREETING: `${translations.hello} {{ receiverName }}`,
    HEADLINE: '',
    HEADLINEIMAGE: '',
    MAINTEXT: '',
    BUTTONTEXT: '',
    INFOTEXT: '',
    BUTTONLINK: '{{ buttonLink }}',
  }

  switch (type) {
    case 'error':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.export,
        HEADLINEIMAGE: createBase64UrlfromPng('error.png'), // image needs to be replaced
        MAINTEXT: message.error,
        BUTTONTEXT: link.archive,
      }
      break
    case 'reportExport':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.export,
        HEADLINEIMAGE: createBase64UrlfromPng('folder.png'),
        MAINTEXT: message.success,
        BUTTONTEXT: link.archive,
      }
      break
    case 'acceptReport':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.accepted,
        HEADLINEIMAGE: createBase64UrlfromPng('illustration.png'),
        MAINTEXT: message.accepted,
        BUTTONTEXT: link.report,
      }
      break
    case 'needChanges':
      emailVariables = {
        ...emailVariables,
        DEFAULTBACKGROUND: createBase64UrlfromPng('background_1.png'),
        HEADLINE: headline.needChanges,
        HEADLINEIMAGE: createBase64UrlfromPng('tablet.png'),
        MAINTEXT: message.needChanges,
        BUTTONTEXT: link.report,
      }
      break
    case 'deleteYourTrainee':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.deleteTrainee,
        HEADLINEIMAGE: createBase64UrlfromPng('deleteUser.png'),
        MAINTEXT: message.deleteTrainee,
        BUTTONTEXT: link.lara,
      }
      break
    case 'deleteAccount':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.deleteAccount,
        HEADLINEIMAGE: createBase64UrlfromPng('delete.png'),
        MAINTEXT: message.deleteAccount,
        BUTTONTEXT: link.lara,
      }
      break
    case 'deleteUser':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.deleteUser,
        HEADLINEIMAGE: createBase64UrlfromPng('deleteUser.png'),
        MAINTEXT: message.deleteUser,
        BUTTONTEXT: link.settings,
      }
      break
    case 'reportInReview':
      emailVariables = {
        ...emailVariables,
        DEFAULTBACKGROUND: createBase64UrlfromPng('background_2.png'),
        HEADLINE: headline.handOver,
        HEADLINEIMAGE: createBase64UrlfromPng('tablet.png'),
        MAINTEXT: message.handOver,
        BUTTONTEXT: link.report,
      }
      break
    case 'alexa':
      emailVariables = {
        ...emailVariables,
        HEADLINE: headline.alexa,
        HEADLINEIMAGE: createBase64UrlfromPng('tablet.png'),
        MAINTEXT: message.alexa,
        BUTTONTEXT: link.settings,
      }
      break
    case 'paperBriefing':
      emailVariables = {
        ...emailVariables,
        DEFAULTBACKGROUND: createBase64UrlfromPng('background_2.png'),
        HEADLINE: headline.paperBriefing,
        HEADLINEIMAGE: createBase64UrlfromPng('folder.png'),
        MAINTEXT: message.paperBriefing,
        BUTTONTEXT: link.paperBriefing,
      }
      break
    default:
      console.error('no email type selected to generate html')
  }

  const html = emailHtmlHandlebars(emailVariables)
  if (!html) {
    console.error('html not generated')
  }
  return html
}
