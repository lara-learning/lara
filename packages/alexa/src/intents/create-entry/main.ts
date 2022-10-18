import {
  getDialogState,
  getIntentName,
  getRequestType,
  RequestHandler,
  ResponseBuilder,
  AttributesManager,
} from 'ask-sdk-core'
import { parse, toSeconds } from 'iso8601-duration'

import { createEntry } from '../../graphql/create-entry'
import { canCreateEntry } from '../../helpers/report'
import { reportDayByDate } from '../../helpers/report-day'
import { validateSession } from '../../helpers/session'
import { getSlotValues } from '../../helpers/slot'
import { nextActionResponse } from '../../helpers/yes-no'

export const CREATE_ENTRY_INTENT = 'CreateEntryIntent'

// Since Alexa doesn't support grammer we try to enhance
// the entry text by making the start of the sentence capital
const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// if the entry cannot be created for the day or report input
const wrongStateResponse = (responseBuilder: ResponseBuilder) =>
  responseBuilder
    .speak('Der Tag oder der Bericht ist im falschen Zustand. Bitte gebe einen anderen Tag an.')
    .reprompt('Für welchen Tag ist der Eintrag?')
    .addElicitSlotDirective('day')
    .getResponse()

// end the intent with success or error and redirect to next intent
const endIntentResponse = (
  responseBuilder: ResponseBuilder,
  attributesManager: AttributesManager,
  success: boolean
) => {
  if (!success) {
    return nextActionResponse('Leider hat das nicht geklappt.', responseBuilder, attributesManager)
  }

  return nextActionResponse('Ich habe den Eintrag erstellt.', responseBuilder, attributesManager)
}

// this response specifically aims at the day slot
const elicitDayResponse = (responseBuilder: ResponseBuilder, message: string) =>
  responseBuilder.speak(message).reprompt(message).addElicitSlotDirective('day').getResponse()

/**
 * Handles the CreateEntryIntent requests which occur after
 * start of the intent.
 */
export const CreateEntryIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === CREATE_ENTRY_INTENT &&
      getDialogState(requestEnvelope) !== 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const sessionResponse = await validateSession(requestEnvelope, responseBuilder)
    if (sessionResponse) {
      return sessionResponse
    }

    const slots = getSlotValues(requestEnvelope, 'text', 'time', 'day')

    // delegate dialog to alexa to fill all slots
    if (!slots.text || !slots.time || !slots.day) {
      return responseBuilder.addDelegateDirective().getResponse()
    }

    // validate the day
    const response = await reportDayByDate(slots.day)

    if (!response.success) {
      return elicitDayResponse(responseBuilder, response.message)
    }

    // check if report and day are valid
    if (!canCreateEntry(response.report, response.day)) {
      return wrongStateResponse(responseBuilder)
    }

    // transform the iso duration to seconds
    const durationInMinutes = toSeconds(parse(slots.time)) / 60
    const success = await createEntry(response.day.id, capitalizeFirstLetter(slots.text), durationInMinutes)

    return endIntentResponse(responseBuilder, attributesManager, success)
  },
}
