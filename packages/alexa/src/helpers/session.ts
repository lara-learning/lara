import { ResponseBuilder } from 'ask-sdk-core'
import { RequestEnvelope, Response } from 'ask-sdk-model'

import { initGQLClient } from '../graphql/client'
import { getCurrentUser } from '../graphql/get-current-user'

type SessionValidation = Response | void

// Validates the token that is send by alexa after the account linking
export const validateSession = async (
  { context }: RequestEnvelope,
  responseBuilder: ResponseBuilder
): Promise<SessionValidation> => {
  const { accessToken } = context.System.user
  if (!accessToken) {
    const msg =
      'Ich konnte dich nicht einloggen. Bitte verbinde in den lara einstellungen deinen amazon und deinen lara account.'

    return responseBuilder.speak(msg).withLinkAccountCard().withShouldEndSession(true).getResponse()
  }

  initGQLClient(accessToken)

  const user = await getCurrentUser()

  if (!user) {
    const msg =
      'Ich konnte dich nicht einloggen. Bitte stelle sicher, dass dein amazon und lara account verbunden sind. Ist dies der fall, führe die kontoverknüpfung erneut durch.'

    return responseBuilder.speak(msg).withLinkAccountCard().withShouldEndSession(true).getResponse()
  }
}
