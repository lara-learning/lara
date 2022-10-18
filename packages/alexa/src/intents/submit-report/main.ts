import { getDialogState, getIntentName, getRequestType, RequestHandler } from 'ask-sdk-core'

import { getReportByYearAndWeek } from '../../graphql/get-report'
import { updateReport } from '../../graphql/update-report'
import { canSubmit } from '../../helpers/report'
import { reportByDate } from '../../helpers/report-day'
import { validateSession } from '../../helpers/session'
import { getSlotValues } from '../../helpers/slot'
import { nextActionResponse } from '../../helpers/yes-no'

export const SUBMIT_REPORT_INTENT = 'SubmitReportIntent'

/**
 * Handle SubmitReportIntent. If successfull the report will
 * be handed to the trainer.
 */
export const SubmitReportIntent: RequestHandler = {
  canHandle({ requestEnvelope }) {
    return (
      getRequestType(requestEnvelope) === 'IntentRequest' &&
      getIntentName(requestEnvelope) === SUBMIT_REPORT_INTENT &&
      getDialogState(requestEnvelope) !== 'STARTED'
    )
  },
  async handle({ responseBuilder, requestEnvelope, attributesManager }) {
    const response = await validateSession(requestEnvelope, responseBuilder)
    if (response) {
      return response
    }

    const { date, week, year } = getSlotValues(requestEnvelope, 'date', 'week', 'year')

    // fill date slot if no values are given
    if (!date && !year && !week) {
      return responseBuilder
        .speak('Welches Datum hat der Bericht?')
        .reprompt('Welches Datum?')
        .addElicitSlotDirective('date')
        .getResponse()
    }

    // fetch report for the input date
    const report = date ? await reportByDate(date) : await getReportByYearAndWeek(Number(year), Number(week))

    // missing report try new date
    if (!report) {
      return responseBuilder
        .speak('Der Bericht konnte nicht gefunden werden. Bitte gebe eine anderes Datum an.')
        .addElicitSlotDirective('date')
        .getResponse()
    }

    // report has wrong status try new date
    if (!canSubmit(report)) {
      return responseBuilder
        .speak(
          'Das Berichtsheft befindet sich im falschen Zustand oder ist nicht vollständig. Bitte gebe eine anderes Datum an.'
        )
        .addElicitSlotDirective('date')
        .getResponse()
    }

    // update the report with lara api
    const success = await updateReport({
      id: report.id,
      department: report.department,
      summary: report.summary,
      status: 'review',
    })

    // something went wrong
    if (!success) {
      return responseBuilder
        .speak(`Leider hat das nicht geklappt. Bitte überprüfe ob der Bericht vollständig ist.`)
        .reprompt('Kann ich etwas anderes für dich tun?')
        .getResponse()
    }

    // redirect the user to next action
    return nextActionResponse(
      `Ich habe das Berichtsheft für die Kalenderwoche ${report.week} abgegeben.`,
      responseBuilder,
      attributesManager
    )
  },
}
