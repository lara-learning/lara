import { getIntentName, getRequestType, RequestHandler, ResponseBuilder } from 'ask-sdk-core'

import { validateSession } from '../helpers/session'
import {
  ConfirmAttributes,
  CreateEntryAttributes,
  SubmitReportAttributes,
  UpdateDayAttributes,
} from '../helpers/yes-no'
import { CREATE_ENTRY_INTENT } from './create-entry/main'
import { HELP_INTENT } from './help'
import { SUBMIT_REPORT_INTENT } from './submit-report/main'
import { UPDATE_DAY_INTENT } from './update-day/main'

// redirect the user back to the SubmitReportIntent including the already filled slots
const submitReportResponse = (responseBuilder: ResponseBuilder, session: SubmitReportAttributes) =>
  responseBuilder
    .addDelegateDirective({
      name: SUBMIT_REPORT_INTENT,
      confirmationStatus: 'CONFIRMED',
      slots: {
        week: { confirmationStatus: 'CONFIRMED', name: 'week', value: session.week },
        year: { confirmationStatus: 'CONFIRMED', name: 'year', value: session.year },
      },
    })
    .getResponse()

// redirect the user back to the UpdateDayIntent including the already filled slots
const updateDayResponse = (responseBuilder: ResponseBuilder, session: UpdateDayAttributes) =>
  responseBuilder
    .addDelegateDirective({
      name: UPDATE_DAY_INTENT,
      confirmationStatus: 'CONFIRMED',
      slots: {
        day: { confirmationStatus: 'CONFIRMED', name: 'day', value: session.day },
      },
    })
    .getResponse()

// redirect the user back to the CreateEntryIntent including the already filled slots
const createEntryResponse = (responseBuilder: ResponseBuilder, session: CreateEntryAttributes) =>
  responseBuilder
    .addDelegateDirective({
      name: CREATE_ENTRY_INTENT,
      confirmationStatus: 'CONFIRMED',
      slots: {
        day: { confirmationStatus: 'CONFIRMED', name: 'day', value: session.day },
        text: { confirmationStatus: 'CONFIRMED', name: 'text', value: session.text },
        time: { confirmationStatus: 'CONFIRMED', name: 'time', value: session.time },
      },
    })
    .getResponse()

const redirectToHelpIntent = (responseBuilder: ResponseBuilder) =>
  responseBuilder.addDelegateDirective({ name: HELP_INTENT, confirmationStatus: 'NONE' }).getResponse()

/**
 * Handles all requests if the user answers with "yes". We save a the context
 * in the session attributes so we know what was the question the user answered.
 */
export const YesIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return getRequestType(requestEnvelope) === 'IntentRequest' && getIntentName(requestEnvelope) === 'AMAZON.YesIntent'
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const session = attributesManager.getSessionAttributes<ConfirmAttributes>()

    if (!session.confirm) {
      return redirectToHelpIntent(responseBuilder)
    }

    switch (session.confirm) {
      case 'CREATE_ENTRY':
        return createEntryResponse(responseBuilder, session)
      case 'SUBMIT_REPORT':
        return submitReportResponse(responseBuilder, session)
      case 'UPDATE_DAY':
        return updateDayResponse(responseBuilder, session)
      case 'NEXT_ACTION':
      default:
        return responseBuilder.speak('Ok. Was soll ich für dich tun?').reprompt('Was soll ich machen?').getResponse()
    }
  },
}
