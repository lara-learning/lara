import { AuthenticatedContext, GqlResolvers, User } from '@lara/api'

import { isAdmin, isTrainee, isTrainer } from '../permissions'
import { allTrainees } from '../repositories/trainee.repo'
import { saveUser } from '../repositories/user.repo'
import { generateAdmin } from '../services/admin.service'
import { alexaSkillLinked } from '../services/alexa.service'
import { generateTrainee } from '../services/trainee.service'
import { generateTrainer } from '../services/trainer.service'

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
    _devsetusertype: async (_parent, { type }, { currentUser }) => {
      let newUser: User = currentUser

      if (!isTrainer(currentUser) && type === 'Trainer') {
        newUser = {
          ...(await generateTrainee(currentUser)),
          ...currentUser,
          type,
        }
      }

      if (!isTrainee(currentUser) && type === 'Trainee') {
        newUser = {
          ...(await generateTrainer(currentUser)),
          ...currentUser,
          type,
        }
      }

      if (!isAdmin(currentUser) && type === 'Admin') {
        newUser = {
          ...generateAdmin(currentUser),
          ...currentUser,
          type,
        }
      }

      return {
        user: await saveUser(newUser),
      }
    },
    updateCurrentUser: async (_parent, { input }, { currentUser }) => {
      const updatedUser = {
        ...currentUser,
        ...input,
      }

      return saveUser(updatedUser)
    },
  },
}
