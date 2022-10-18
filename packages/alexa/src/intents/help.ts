import { getIntentName, RequestHandler, getRequestType } from 'ask-sdk-core'

import { validateSession } from '../helpers/session'

export const HELP_INTENT = 'AMAZON.HelpIntent'

/**
 * Handles Help requests which should point the user to the features of the skill
 */
export const HelpIntentHandler: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return getRequestType(requestEnvelope) === 'IntentRequest' && getIntentName(requestEnvelope) === HELP_INTENT
  },
  async handle({ responseBuilder, requestEnvelope }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const speakOutput =
      'Ich kann für dich Einträge erstellen, den Tagesstatus ändern oder ein Berichtsheft an deinen Ausbilder abgeben'

    return responseBuilder.speak(speakOutput).reprompt('Was kann ich für dich tun?').getResponse()
  },
}
