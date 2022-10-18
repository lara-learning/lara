import { RequestHandler } from 'express'
import { decode } from 'jsonwebtoken'

import { User } from '@lara/api'

import { updateUser, userById, userByOAuthCode } from '../repositories/user.repo'
import { createOAuthData, TokensRequest, TokensResponse, validateJWT } from '../services/oauth.service'
import { log } from '../utils/logging'

type AuthorizeResponse = TokensResponse | string

/**
 * Handles the OAuth requests. Endpoint can either be used to trade
 * an oauth code for access-token or to refresh the access-token
 * @param param0 Express request
 * @param res Express response
 * @returns void
 */
export const handleAuthorizeRequest: RequestHandler<unknown, AuthorizeResponse, TokensRequest> = async (
  { body, headers },
  res
) => {
  if (!headers.authorization) {
    return res.status(401).send('Missing authorization')
  }

  if (!body) {
    return res.status(400).send('Mailformed request')
  }

  let user: User | undefined

  log('Authorize request ', JSON.stringify(body))

  // On first authorization we need to remove the auth code
  // that identifies the user.
  if (body.grant_type === 'authorization_code') {
    user = await userByOAuthCode(body.code).then(
      (trainee) => trainee && updateUser(trainee, { removeKeys: ['oAuthCode'] })
    )
  }

  // search user for refresh token
  if (body.grant_type === 'refresh_token') {
    const payload = validateJWT(body.refresh_token)

    if (payload) {
      const accessToken = decode(payload.sub, { json: true })

      // get the trainee based on the id claim in jwt
      user = accessToken?.sub ? await userById(accessToken.sub) : undefined
    }
  }

  // Currently only trainees can be authorized by oauth
  if (!user) {
    return res.status(401).send('Wrong authorization')
  }

  const { accessToken, expiresIn, refreshToken } = createOAuthData(user)

  log('Tokens ', accessToken, refreshToken ?? 'no refresh token')

  return res.status(200).send({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: 'bearer',
  })
}
