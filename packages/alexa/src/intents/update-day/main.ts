import { getDialogState, getIntentName, getRequestType, getSlot, RequestHandler } from 'ask-sdk-core'
import { Intent, Slot } from 'ask-sdk-model'

import { dayStatusToText, statusIdToDayStatus, updateDay } from '../../graphql/update-day'
import { formatDateForSpeech } from '../../helpers/date'
import { isOpen } from '../../helpers/report'
import { reportDayByDate } from '../../helpers/report-day'
import { validateSession } from '../../helpers/session'
import { getSlotId } from '../../helpers/slot'
import { nextActionResponse } from '../../helpers/yes-no'

export const UPDATE_DAY_INTENT = 'UpdateDayIntent'

/**
 * Handles UpdateDayIntent requests. If successfull this can change
 * the status of a given day.
 */
export const UpdateDayIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === UPDATE_DAY_INTENT &&
      getDialogState(requestEnvelope) !== 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const dialogState = getDialogState(requestEnvelope)

    const sessionResponse = await validateSession(requestEnvelope, responseBuilder)
    if (sessionResponse) {
      return sessionResponse
    }

    const statusSlot = getSlot(requestEnvelope, 'status')
    const daySlot = getSlot(requestEnvelope, 'day')

    // we need to use the session instead of the slot directly. See comment in started.ts
    const { status } = attributesManager.getSessionAttributes<{ status?: Slot }>()

    // fallback to the slot value
    const statusId = getSlotId(status ?? statusSlot)
    const gqlStatus = statusId && statusIdToDayStatus(statusId)

    /**
     * This hacks around the problem that alexa won't process custom slots
     * in the delegate directive. At this point in the conversation (coming from
     * the YesNoIntent) the dialog state is COMPLETE. We neeed to "restart"
     * the intent to ask for the status again
     */
    if (!gqlStatus) {
      const updateIntent: Intent | undefined =
        dialogState === 'COMPLETED'
          ? {
              confirmationStatus: 'CONFIRMED',
              name: UPDATE_DAY_INTENT,
              slots: { day: daySlot },
            }
          : undefined

      return responseBuilder
        .speak('Auf welchen Status soll ich den Tag ändern?')
        .reprompt('Welchen Status?')
        .addElicitSlotDirective('status', updateIntent)
        .getResponse()
    }

    const dayInput = daySlot.value

    // get the day from the user first
    if (!dayInput) {
      return responseBuilder
        .speak('Welches Datum hat der Tag?')
        .reprompt('Welchen Tag soll ich ändern?')
        .addElicitSlotDirective('day')
        .getResponse()
    }

    const response = await reportDayByDate(dayInput)

    if (!response.success) {
      return responseBuilder.speak(response.message).reprompt(response.message).getResponse()
    }

    // validate the report
    if (!isOpen(response.report)) {
      return responseBuilder
        .speak('Der Bericht befindet sich im falschen Zustand. Bitte gebe einen anderen Tag ein.')
        .reprompt('Bitte gebe einen anderen Tag ein.')
        .addElicitSlotDirective('day')
        .getResponse()
    }

    const success = await updateDay(response.day.id, gqlStatus)

    if (!success) {
      return nextActionResponse(`Das hat leider nicht geklappt.`, responseBuilder, attributesManager)
    }

    return nextActionResponse(
      `Ich ändere den status für ${formatDateForSpeech(response.day.date)} zu ${dayStatusToText(gqlStatus)}.`,
      responseBuilder,
      attributesManager
    )
  },
}
