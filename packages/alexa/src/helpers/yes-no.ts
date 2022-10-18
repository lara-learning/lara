import { AttributesManager, ResponseBuilder } from 'ask-sdk-core'
import { Response } from 'ask-sdk-model'

export type SubmitReportAttributes = { confirm: 'SUBMIT_REPORT'; week: string; year: string }

export type CreateEntryAttributes = { confirm: 'CREATE_ENTRY'; day?: string; text?: string; time?: string }

export type UpdateDayAttributes = { confirm: 'UPDATE_DAY'; day: string }

export type NextActionAttributes = { confirm: 'NEXT_ACTION' }

export type ConfirmAttributes =
  | SubmitReportAttributes
  | CreateEntryAttributes
  | UpdateDayAttributes
  | NextActionAttributes

// write the converstion context into the session attributes for the YesNoIntent
export const prepareYesNoIntent = (attributesManager: AttributesManager, session: ConfirmAttributes): void => {
  const prevSession = attributesManager.getSessionAttributes()

  attributesManager.setSessionAttributes({
    ...prevSession,
    ...session,
  })
}

// redirect user to next Intent
export const nextActionResponse = (
  output: string,
  responseBuilder: ResponseBuilder,
  attributesManager: AttributesManager
): Response => {
  const session: ConfirmAttributes = {
    confirm: 'NEXT_ACTION',
  }

  attributesManager.setSessionAttributes(session)

  return responseBuilder
    .speak(`${output} Kann ich noch etwas für dich tun?`)
    .reprompt('Kann ich noch etwas für dich tun?')
    .getResponse()
}
