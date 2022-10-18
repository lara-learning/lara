import { getRequestType, RequestHandler } from 'ask-sdk-core'

/**
 * Handles the end of the skill and can contain cleanup logic
 */
export const SessionEndedHandler: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return getRequestType(requestEnvelope) === 'SessionEndedRequest'
  },
  handle({ responseBuilder }) {
    // Any cleanup logic goes here.
    return responseBuilder.getResponse()
  },
}
