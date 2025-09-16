import casual from 'casual'
import { addYears, subWeeks } from 'date-fns'
import { GraphQLError } from 'graphql'

import { GqlResolvers } from '@lara/api'

import { t } from '../i18n'
import { isDebug } from '../permissions'
import { userById, userByEmail, saveUser } from '../repositories/user.repo'
import { createOAuthData } from '../services/oauth.service'
import { generateTrainee } from '../services/trainee.service'

const createMockUser = async (email: string) => {
  const userModel = await generateTrainee({
    email,
    firstName: casual.first_name,
    lastName: casual.last_name,
    startDate: subWeeks(new Date(), 2).toISOString(),
    endDate: addYears(new Date(), 2).toISOString(),
  })

  userModel.createdAt = subWeeks(new Date(), 8).toISOString()

  return saveUser(userModel)
}

const isDevEnv = (): boolean => process.env.NODE_ENV === 'development'

export const authResolver: GqlResolvers = {
  Mutation: {
    login: async (_parent, { email }) => {
      if (!email) {
        return
      }

      let user = await userByEmail(email)

      // creates mock user on dev stages
      if (!user && isDevEnv()) {
        user = await createMockUser(email)
      }

      if (!user) {
        throw new GraphQLError('USER_NOT_REGISTERED')
      }

      return createOAuthData(user)
    },
    _devloginuser: async (_parent, { id }) => {
      if (!isDebug()) {
        throw new GraphQLError("Mutation isn't allowed in this Environment")
      }

      const user = await userById(id)
      if (!user) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      return createOAuthData(user)
    },
  },
}
