import { getIntentName, getRequestType, RequestHandler, ResponseBuilder } from 'ask-sdk-core'

import { validateSession } from '../helpers/session'
import { ConfirmAttributes } from '../helpers/yes-no'
import { CREATE_ENTRY_INTENT } from './create-entry/main'
import { HELP_INTENT } from './help'
import { SUBMIT_REPORT_INTENT } from './submit-report/main'
import { UPDATE_DAY_INTENT } from './update-day/main'

// redirect the user back to the SubmitReportIntent
const submitReportResponse = (responseBuilder: ResponseBuilder) =>
  responseBuilder
    .speak(`Ok. Welches Datum hat das Berichtsheft?`)
    .reprompt('Welches Datum hat der Bericht, den du abgeben möchtest?')
    .addElicitSlotDirective('date', { name: SUBMIT_REPORT_INTENT, confirmationStatus: 'NONE' })
    .getResponse()

// redirect the user back to the CreateEntryIntent
const createEntryResponse = (responseBuilder: ResponseBuilder) =>
  responseBuilder
    .speak(`Ok. Für welchen Tag ist der Eintrag?`)
    .reprompt('Welchen Tag?')
    .addElicitSlotDirective('day', { confirmationStatus: 'NONE', name: CREATE_ENTRY_INTENT })
    .getResponse()

// redirect the user back to the UpdateDayIntent
const updateDayResponse = (responseBuilder: ResponseBuilder) =>
  responseBuilder
    .speak(`Ok. Welchen Tag?`)
    .reprompt('Welchen Tag soll ich ändern?')
    .addElicitSlotDirective('day', { name: UPDATE_DAY_INTENT, confirmationStatus: 'NONE' })
    .getResponse()

/**
 * Handles all requests if the user answers with "no". We save a the context
 * in the session attributes so we know what was the question the user answered.
 */
export const NoIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return getRequestType(requestEnvelope) === 'IntentRequest' && getIntentName(requestEnvelope) === 'AMAZON.NoIntent'
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const { request } = requestEnvelope
    if (request.type !== 'IntentRequest') {
      return responseBuilder.addDelegateDirective().getResponse()
    }

    if (request.dialogState === 'STARTED') {
      return responseBuilder.addDelegateDirective().getResponse()
    }

    const session = attributesManager.getSessionAttributes<ConfirmAttributes>()
    if (!session.confirm) {
      return responseBuilder.addDelegateDirective({ name: HELP_INTENT, confirmationStatus: 'NONE' }).getResponse()
    }

    switch (session.confirm) {
      case 'CREATE_ENTRY':
        return createEntryResponse(responseBuilder)
      case 'SUBMIT_REPORT':
        return submitReportResponse(responseBuilder)
      case 'UPDATE_DAY':
        return updateDayResponse(responseBuilder)
      case 'NEXT_ACTION':
        return responseBuilder.speak('Ok tschau').withShouldEndSession(true).getResponse()
      default:
        return responseBuilder.addDelegateDirective({ name: HELP_INTENT, confirmationStatus: 'NONE' }).getResponse()
    }
  },
}
