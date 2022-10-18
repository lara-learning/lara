import { getIntentName, getRequestType, RequestHandler } from 'ask-sdk-core'

/**
 * Handles Cancel and Stop requests which will end the current session, intent and skill
 */
export const CancelAndStopIntentHandler: RequestHandler = {
  canHandle({ requestEnvelope }) {
    const cancelIntent = getIntentName(requestEnvelope) === 'AMAZON.CancelIntent'
    const stopIntent = getIntentName(requestEnvelope) === 'AMAZON.StopIntent'

    return getRequestType(requestEnvelope) === 'IntentRequest' && (cancelIntent || stopIntent)
  },
  handle({ responseBuilder }) {
    const speakOutput = 'Ok tschau!'

    return responseBuilder.speak(speakOutput).withShouldEndSession(true).getResponse()
  },
}
