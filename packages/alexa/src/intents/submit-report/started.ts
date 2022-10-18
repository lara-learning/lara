import { getDialogState, getIntentName, getRequestType, RequestHandler } from 'ask-sdk-core'
import { getISOWeek, getISOWeekYear } from 'date-fns'

import { getReportByYearAndWeek } from '../../graphql/get-report'
import { canSubmit } from '../../helpers/report'
import { validateSession } from '../../helpers/session'
import { getSlotValues } from '../../helpers/slot'
import { prepareYesNoIntent } from '../../helpers/yes-no'
import { SUBMIT_REPORT_INTENT } from './main'

/**
 * Handler start request of the SubmitReportIntent. Checks default values
 * for the slots. For example picks the current week if the year slot is given.
 */
export const StartedSubmitReportIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === SUBMIT_REPORT_INTENT &&
      getDialogState(requestEnvelope) === 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const { date, week, year } = getSlotValues(requestEnvelope, 'date', 'week', 'year')

    let prompt = ''
    let reprompt = ''
    let slotToElicit = ''

    let weekInput: number | undefined
    let yearInput: number | undefined

    // when the user fills week slot on start, we ask for the year
    if (week) {
      weekInput = Number(week)
      yearInput = getISOWeekYear(new Date())

      slotToElicit = 'year'
      prompt = 'In welchem Jahr ist der Bericht?'
      reprompt = 'Welches Jahr?'
    }

    // when the user fill year slot on start, we ask for the week
    if (year) {
      weekInput = getISOWeek(new Date())
      yearInput = Number(year)

      slotToElicit = 'week'
      prompt = 'Welche Kalenderwoche hat der Bericht?'
      reprompt = 'Welche Kalenderwoche?'
    }

    // we try to submit the current report if no slots are filled at all
    if (!weekInput && !yearInput && !date) {
      weekInput = getISOWeek(new Date())
      yearInput = getISOWeekYear(new Date())

      slotToElicit = 'date'
      prompt = 'Welches Datum hat der Bericht?'
      reprompt = 'Bitte nenne einen Datum, das in der Woche des Berichts liegt, den du abgeben möchtest'
    }

    // get the report and validate it
    if (weekInput && yearInput) {
      const report = await getReportByYearAndWeek(yearInput, weekInput)

      // ask the user for confirmation
      if (report && (await canSubmit(report))) {
        // prepare session for yes/no intent
        prepareYesNoIntent(attributesManager, {
          confirm: 'SUBMIT_REPORT',
          week: String(weekInput),
          year: String(yearInput),
        })

        // redirect the user to the yes/no intent
        return responseBuilder
          .speak(`Soll ich den Bericht ${weekInput} von ${yearInput} abgeben?`)
          .reprompt(`Soll ich den Bericht ${weekInput} abgeben?`)
          .getResponse()
      }

      // ask for missing slot input
      return responseBuilder.speak(prompt).reprompt(reprompt).addElicitSlotDirective(slotToElicit).getResponse()
    }

    // delegate converstion to alexa and redirect to the main SubmitReportIntent handler
    return responseBuilder.addDelegateDirective().getResponse()
  },
}
