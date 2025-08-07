import { isFuture } from 'date-fns'

import { User } from '@lara/api'

import { AlexaAmazonClientId, AlexaAmazonClientSecret, AlexaSkillId, BackendUrl, FrontendUrl } from '../constants'
import { saveTokenResponse, updateUser } from '../repositories/user.repo'
import { parseISODateString } from '../utils/date'
import { parseOkJson } from '../utils/fetch'
import { log } from '../utils/logging'
import { createRandomToken } from '../utils/security'
import { TokensResponse } from './oauth.service'

const { IS_OFFLINE, BACKEND_TUNNEL_URL, FRONTEND_TUNNEL_URL, ALEXA_SKILL_STAGE } = process.env

if (!ALEXA_SKILL_STAGE) {
  throw new Error('Missing Env Variable: ALEXA_SKILL_STAGE')
}

/**
 * if a tunnel is running for local debugging we use it
 */
export const frontendAlexaUrl = `${IS_OFFLINE && FRONTEND_TUNNEL_URL ? FRONTEND_TUNNEL_URL : FrontendUrl}/alexa`
const backendOAuthUrl = `${IS_OFFLINE && BACKEND_TUNNEL_URL ? BACKEND_TUNNEL_URL : BackendUrl}/backend/oauth/token`

/**
 * Creates the Amazon Login Url
 * @param state State to prevent cross site request forgery
 * @param redirectUrl Lara Url to open after amazon login
 * @returns Frontend Url
 */
export const alexaLinkingUrl = (state: string, redirectUrl: string): string => {
  return `https://www.amazon.com/ap/oa?client_id=${AlexaAmazonClientId}&scope=alexa::skills:account_linking&response_type=code&redirect_uri=${redirectUrl}&state=${state}`
}

const authServiceUrl = 'https://api.amazon.com/auth/o2/token'
const skillActivationAPI = `https://api.eu.amazonalexa.com/v1/users/~current/skills/${AlexaSkillId}/enablement`

const skillStage = ALEXA_SKILL_STAGE

/**
 * Exchanges the amazon code with the amazon access tokens
 * @param code Amazon Auth Code
 * @returns Response with access and refresh token
 */
export const alexaTokensByCode = async (code: string): Promise<TokensResponse | undefined> => {
  return fetch(authServiceUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: frontendAlexaUrl,
      client_id: AlexaAmazonClientId,
      client_secret: AlexaAmazonClientSecret,
    }),
  })
    .then((res) => parseOkJson<TokensResponse>(res))
    .catch((e) => {
      log('Alexa error token exchange ', e)
      return undefined
    })
}

type SkillActivationResponse = {
  skill: { stage: string; id: string }
  user: { id: string }
  accountLink: { status: 'LINKED' | 'NOT_LINKED' }
  status: 'ENABLING' | 'ENABLING' | 'ENABLING_FAILED' | 'DISABLED' | 'DISABLING' | 'DISABLING_FAILED' | 'NO_ASSOCIATION'
}

/**
 * Activates and links the alexa skill
 * @param user Current user
 * @returns Skill response
 */
export const activateAlexaSkill = async (user: User): Promise<SkillActivationResponse | undefined> => {
  const oAuthCode = await createRandomToken(32)
  await updateUser({ ...user, oAuthCode: oAuthCode }, { updateKeys: ['oAuthCode'] })

  return fetch(skillActivationAPI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.amazonAccessToken,
    },
    body: JSON.stringify({
      stage: skillStage,
      accountLinkRequest: {
        redirectUri: backendOAuthUrl,
        authCode: oAuthCode,
        type: 'AUTH_CODE',
      },
    }),
  })
    .then((res) => parseOkJson<SkillActivationResponse>(res))
    .catch((e) => {
      log('Alexa activate skill error ', e)
      return undefined
    })
}

/**
 * Fetches the new access tokens with the refresh token.
 * @param user User to refresh token
 * @returns Response with new tokens
 */
export const refreshAmazonTokens = async (user: User): Promise<User> => {
  // dont refresh the tokens if they aren't expired
  if (!user.amazonRefreshDate || isFuture(parseISODateString(user.amazonRefreshDate))) {
    return user
  }

  return fetch(authServiceUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: user.amazonRefreshToken,
      client_id: AlexaAmazonClientId,
      client_secret: AlexaAmazonClientSecret,
    }),
  })
    .then((res) => parseOkJson<TokensResponse>(res))
    .then((tokens) => (tokens ? saveTokenResponse({ user, response: tokens }) : user))
    .catch((e) => {
      log('Alexa refresh tokens error ', e)
      return user
    })
}

/**
 * Fetches the current status of the account linking
 * @param user User to check status
 * @returns Skill response
 */
export const isSkillLinked = async (user: User): Promise<SkillActivationResponse | undefined> => {
  return fetch(skillActivationAPI, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.amazonAccessToken,
    },
  })
    .then((res) => parseOkJson<SkillActivationResponse>(res))
    .catch((e) => {
      log('Alexa skill linked error ', e)
      return undefined
    })
}

/**
 * Deactivates and unlinks the alexa skill
 * @param user User to check status
 * @returns Skill response
 */
export const deactivateSkill = async (user: User): Promise<boolean | undefined> => {
  return fetch(skillActivationAPI, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.amazonAccessToken,
    },
  })
    .then((res) => res.ok)
    .catch((e) => {
      log('Alexa deactivate skill error', e)

      return false
    })
}

/**
 * Checks if the User has linked the alexa skill
 * @param user User
 * @returns boolean
 */
export const alexaSkillLinked = async (user: User): Promise<boolean> => {
  if (!user.amazonAccessToken && !user.amazonRefreshToken) {
    return false
  }

  return await refreshAmazonTokens(user)
    .then(isSkillLinked)
    .then((response) => response?.accountLink.status === 'LINKED')
}
