import { AuthenticatedContext, GqlResolvers } from '@lara/api'

import { allTrainees } from '../repositories/trainee.repo'
import { saveUser } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'

export const userResolver: GqlResolvers<AuthenticatedContext> = {
  UserInterface: {
    __resolveType: (model) => {
      return model.type
    },
    alexaSkillLinked,
  },
  Query: {
    trainees: allTrainees,
    currentUser: (_parent, _args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    updateCurrentUser: async (_parent, { input }, { currentUser }) => {
      const updatedUser = {
        ...currentUser,
        ...input,
      }

      return saveUser(updatedUser)
    },
  },
}
