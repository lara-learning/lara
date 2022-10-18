import { getDialogState, getIntentName, getRequestType, getSlot, RequestHandler } from 'ask-sdk-core'

import { formatDateForSpeech } from '../../helpers/date'
import { isOpen } from '../../helpers/report'
import { reportDayByDate } from '../../helpers/report-day'
import { validateSession } from '../../helpers/session'
import { getSlotId, getSlotValues } from '../../helpers/slot'
import { prepareYesNoIntent } from '../../helpers/yes-no'
import { UPDATE_DAY_INTENT } from './main'

export const StartedUpdateDayIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === UPDATE_DAY_INTENT &&
      getDialogState(requestEnvelope) === 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const sessionResponse = await validateSession(requestEnvelope, responseBuilder)
    if (sessionResponse) {
      return sessionResponse
    }

    const { day } = getSlotValues(requestEnvelope, 'day', 'status')
    const status = getSlot(requestEnvelope, 'status')

    // day is already picked
    if (day) {
      return responseBuilder.addDelegateDirective().getResponse()
    }

    /**
     * Save the status in the session. This is necessary since the
     * manual dialog delegation doesn't work with custom slots.
     * For some reason alexa just ends the dialog after the Yes Intent
     * even though all slots are filled
     */
    if (getSlotId(status)) {
      attributesManager.setSessionAttributes({ status })
    }

    const currentDate = new Date().toISOString()
    const response = await reportDayByDate(currentDate)

    if (response.success && isOpen(response.report)) {
      prepareYesNoIntent(attributesManager, { confirm: 'UPDATE_DAY', day: currentDate })

      return responseBuilder
        .speak(`Soll ich den Status für heute ändern?`)
        .reprompt(`Soll ich den Status für ${formatDateForSpeech(currentDate)} ändern?`)
        .getResponse()
    }

    return responseBuilder.addDelegateDirective().getResponse()
  },
}
