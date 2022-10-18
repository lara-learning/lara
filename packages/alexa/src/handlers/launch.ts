import { getRequestType, RequestHandler } from 'ask-sdk-core'

import { validateSession } from '../helpers/session'

/**
 * Handles the start of the skill without an Intent. Main purpose is
 * the check of authentication
 */
export const LaunchRequestHandler: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return getRequestType(requestEnvelope) === 'LaunchRequest'
  },
  async handle({ responseBuilder, requestEnvelope }) {
    const response = await validateSession(requestEnvelope, responseBuilder)

    if (response) {
      return response
    }

    return responseBuilder
      .speak('Willkommen bei Lara. Was kann ich für dich tun?')
      .reprompt('Ich kann zum Beispiel einen neuen Eintrag hinzufügen')
      .getResponse()
  },
}
