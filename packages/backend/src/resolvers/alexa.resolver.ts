import { GraphQLError } from 'graphql'

import { AuthenticatedContext, GqlResolvers } from '@lara/api'

import { t } from '../i18n'
import { saveTokenResponse, updateUser } from '../repositories/user.repo'
import {
  activateAlexaSkill,
  alexaLinkingUrl,
  alexaTokensByCode,
  deactivateSkill,
  frontendAlexaUrl,
  refreshAmazonTokens,
} from '../services/alexa.service'
import { sendAlexaNotificationMail } from '../services/email.service'
import { createCsrfState } from '../services/oauth.service'
import { log } from '../utils/logging'
import { createRandomToken } from '../utils/security'

export const alexaResolver: GqlResolvers<AuthenticatedContext> = {
  Query: {
    alexaLinkingUrl: async (_parent, _args, { currentUser }) => {
      const state = await createCsrfState()

      currentUser.oAuthState = state

      return updateUser(currentUser, { updateKeys: ['oAuthState'] }).then(() =>
        alexaLinkingUrl(state, frontendAlexaUrl)
      )
    },
  },
  Mutation: {
    linkAlexa: async (_parent, { code, state }, { currentUser }) => {
      log('State ', state, currentUser.oAuthState ?? '')

      if (state !== currentUser.oAuthState) {
        throw new GraphQLError(t('errors.missingTokens', currentUser.language))
      }

      const tokens = await alexaTokensByCode(code)

      log('Alexa Tokens ', JSON.stringify(tokens ?? ''))

      if (!tokens) {
        throw new GraphQLError(t('errors.missingTokens', currentUser.language))
      }

      return saveTokenResponse({ user: currentUser, response: tokens, removeState: true })
        .then(activateAlexaSkill)
        .then(async (res) => {
          await sendAlexaNotificationMail(currentUser)

          log('Activate skill response ', JSON.stringify(res ?? ''))

          return res?.accountLink.status === 'LINKED' || res?.status === 'ENABLING' ? currentUser : undefined
        })
    },
    unlinkAlexa: async (_parent, _args, { currentUser }) => {
      const trainee = await refreshAmazonTokens(currentUser)
      const success = await deactivateSkill(trainee)

      if (!success) {
        return trainee
      }

      return updateUser(trainee, {
        removeKeys: ['amazonAccessToken', 'amazonRefreshToken', 'amazonRefreshDate', 'oAuthCode', 'oAuthState'],
      })
    },
    createOAuthCode: async (_parent, _args, { currentUser }) => {
      const oAuthCode = await createRandomToken(32)
      await updateUser({ ...currentUser, oAuthCode: oAuthCode }, { updateKeys: ['oAuthCode'] })

      return oAuthCode
    },
  },
}
