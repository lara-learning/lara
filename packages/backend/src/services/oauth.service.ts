import { hoursToSeconds } from 'date-fns'
import { sign, verify } from 'jsonwebtoken'

import { User } from '@lara/api'

import { LaraSecret } from '../constants'
import { createRandomToken } from '../utils/security'

export type TokensResponse = {
  access_token: string
  refresh_token?: string
  token_type: 'bearer'
  expires_in: number
}

export type TokensRequest = AuthCodeRequest | RefreshTokenRequest

export type AuthCodeRequest = {
  grant_type: 'authorization_code'
  code: string
  client_id: string
  redirect_uri: string
}

export type RefreshTokenRequest = {
  grant_type: 'refresh_token'
  refresh_token: string
  client_id: string
  redirect_uri: string
}

/**
 * Creates cross site request forgery state
 * @returns Random string
 */
export const createCsrfState = (): Promise<string> => createRandomToken(8)

export type OAuthData = {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

/**
 * Registered JWT claims:
 * exp = Expiration date in UTC seconds
 * sub = Subject of the JWT
 */
type JWTPayload = {
  sub: string
  exp?: number
}

type ValidatedJWTPayload = JWTPayload & {
  exp: number
}

/**
 * Creates random tokens and expire time
 * @returns Tokens and expiresIn
 */
export const createOAuthData = (user: User): OAuthData => {
  const accessTokenExpiresIn = hoursToSeconds(1)

  const accessPayload: JWTPayload = { sub: user.id }
  const accessToken = sign(accessPayload, LaraSecret, { expiresIn: accessTokenExpiresIn })

  // we save the accessToken as the sub in the refreshToken
  const refreshPayload: JWTPayload = { sub: accessToken }
  const refreshToken = sign(refreshPayload, LaraSecret, { expiresIn: hoursToSeconds(24 * 30) })

  return {
    accessToken,
    refreshToken,
    expiresIn: accessTokenExpiresIn,
  }
}

/**
 * Validates the JWT and retrieves the payload
 * @param jwt Token string
 * @returns Payload or nothing
 */
export const validateJWT = (jwt: string): ValidatedJWTPayload | undefined => {
  try {
    const decoded = verify(jwt, LaraSecret, { algorithms: ['HS256'] })
    if (
      typeof decoded !== 'object' ||
      typeof decoded.sub !== 'string' ||
      !decoded.sub.trim() ||
      typeof decoded.exp !== 'number'
    ) {
      return
    }

    return {
      sub: decoded.sub,
      exp: decoded.exp,
    }
  } catch (_) {
    return undefined
  }
}
