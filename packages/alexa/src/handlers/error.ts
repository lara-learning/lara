import { ErrorHandler as InternalErrorHandler } from 'ask-sdk-core'

/**
 * Handle Errors that are thrown during the execution of the skill
 */
export const ErrorHandler: InternalErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Alexa Error handled: ${error.stack}`)
    const speakOutput = 'Es ist ein Fehler aufgetreten'

    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
  },
}
