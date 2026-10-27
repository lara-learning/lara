import { RequestHandler } from 'express'

import { userByEmail } from '../repositories/user.repo'
import { createOAuthData, OAuthData } from '../services/oauth.service'
import { emailFromMicrosoftIdToken } from '../services/microsoft-auth.service'

type MicrosoftLoginRequest = {
  idToken: string
}

type MicrosoftLoginResponse = OAuthData | string

export const handleMicrosoftLoginRequest: RequestHandler<
  unknown,
  MicrosoftLoginResponse,
  MicrosoftLoginRequest
> = async ({ body }, res) => {
  if (typeof body?.idToken !== 'string' || !body.idToken) {
    return res.status(400).send('Malformed request')
  }

  const email = await emailFromMicrosoftIdToken(body.idToken)
  if (!email) {
    return res.status(401).send('Wrong authorization')
  }

  const user = await userByEmail(email)
  if (!user) {
    return res.status(404).send('User not registered')
  }

  return res.status(200).send(createOAuthData(user))
}
