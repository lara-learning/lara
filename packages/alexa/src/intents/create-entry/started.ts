import { getDialogState, getIntentName, getRequestType, RequestHandler } from 'ask-sdk-core'

import { canCreateEntry } from '../../helpers/report'
import { reportDayByDate } from '../../helpers/report-day'
import { validateSession } from '../../helpers/session'
import { getSlotValues } from '../../helpers/slot'
import { prepareYesNoIntent } from '../../helpers/yes-no'
import { CREATE_ENTRY_INTENT } from './main'

/**
 * Handles the Start Request of the CreateEntryIntent. Handler
 * checks default value for the day slot to present good user experience
 */
export const StartedCreateEntryIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === CREATE_ENTRY_INTENT &&
      getDialogState(requestEnvelope) === 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const slots = getSlotValues(requestEnvelope, 'day', 'text', 'time')

    /**
     * assume the user wants to create an entry for today if the intent
     * has started without a day slot value
     */
    if (!slots.day) {
      const date = new Date().toISOString()

      const response = await reportDayByDate(date)

      // check if current day and report is valid
      if (response.success && canCreateEntry(response.report, response.day)) {
        // prepare session for yes/no intent
        prepareYesNoIntent(attributesManager, { confirm: 'CREATE_ENTRY', ...slots, day: date })

        // redirect the user to the yes and no intent
        return responseBuilder
          .speak('Soll ich den Eintrag für heute erstellen?')
          .reprompt('Soll der Eintrag heute sein?')
          .getResponse()
      }
    }

    // delegate conversation to alexa and to the main EntryIntent handler
    return responseBuilder.addDelegateDirective().getResponse()
  },
}
