import { addMonths, isFuture, isToday, subWeeks } from 'date-fns'
import { GraphQLError } from 'graphql'

import { Admin, AdminContext, GqlResolvers, Trainee, Trainer, User } from '@lara/api'

import { isAdmin, isTrainee, isTrainer } from '../permissions'
import { traineeById } from '../repositories/trainee.repo'
import { trainerById, allTrainers } from '../repositories/trainer.repo'
import { allAdmins } from '../repositories/admin.repo'
import { generateAdmin, validateAdmin } from '../services/admin.service'
import { allUsers, saveUser, updateUser, userByEmail, userById } from '../repositories/user.repo'
import { sendDeletionMail } from '../services/email.service'
import { deleteTrainee, generateReports, generateTrainee, validateTrainee } from '../services/trainee.service'
import { deleteTrainer, generateTrainer, validateTrainer } from '../services/trainer.service'
import { parseISODateString } from '../utils/date'
import { t } from '../i18n'

export const adminResolver: GqlResolvers<AdminContext> = {
  Admin: {},
  Query: {
    admins: allAdmins,
    trainers: allTrainers,
    async cleanup() {
      const users = await allUsers()

      await Promise.all(
        users.map(async (user) => {
          if (isAdmin(user) || !user.deleteAt) {
            return
          }

          const deleteAt = parseISODateString(user.deleteAt)

          if (isToday(subWeeks(deleteAt, 1))) {
            await sendDeletionMail(user)
          }

          if (isFuture(deleteAt)) {
            return
          }

          if (isTrainee(user)) {
            await deleteTrainee(user)
          }

          if (isTrainer(user)) {
            await deleteTrainer(user)
          }
        })
      )

      return true
    },
    getUser: async (_parent, { id }, { currentUser }) => {
      const user = await userById<User>(id)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      return user
    },
  },
  Mutation: {
    markUserForDeletion: async (_parent, { id }, { currentUser }) => {
      const user = await userById(id)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      user.deleteAt = addMonths(new Date(), 3).toISOString()

      await updateUser(user, { updateKeys: ['deleteAt'] })

      await sendDeletionMail(user)

      return user
    },
    unmarkUserForDeletion: async (_parent, { id }, { currentUser }) => {
      const user = await userById(id)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      return updateUser(user, { removeKeys: ['deleteAt'] })
    },
  },
}

export const trainerAdminResolver: GqlResolvers<AdminContext> = {
  Mutation: {
    createTrainer: async (_parent, { input }, { currentUser }) => {
      const existingUser = await userByEmail(input.email)

      if (existingUser) {
        throw new GraphQLError(t('errors.userAlreadyExists', currentUser.language))
      }

      const newTrainer = await generateTrainer(input)

      return saveUser(newTrainer)
    },
    updateTrainer: async (_parent, { input, id }, { currentUser }) => {
      const trainer = await trainerById(id)

      if (!trainer) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      const updatedTrainer: Trainer = {
        ...trainer,
        ...input,
      }

      await validateTrainer(updatedTrainer)

      // we need to save the user and not update it
      // because we don't know what exactly changed
      // if we use update DDB would throw an error
      return saveUser(updatedTrainer)
    },
  },
}

export const traineeAdminResolver: GqlResolvers<AdminContext> = {
  Mutation: {
    createTrainee: async (_parent, { input }, { currentUser }) => {
      const existingUser = await userByEmail(input.email)

      if (existingUser) {
        throw new GraphQLError(t('errors.userAlreadyExists', currentUser.language))
      }

      const newTrainee = await generateTrainee(input)

      await validateTrainee(newTrainee, currentUser.language)
      await generateReports(newTrainee)

      return saveUser(newTrainee)
    },
    updateTrainee: async (_parent, { input, id }, { currentUser }) => {
      const trainee = await traineeById(id)

      if (!trainee) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      const updatedTrainee: Trainee = {
        ...trainee,
        ...input,
      }

      await validateTrainee(updatedTrainee, currentUser.language)

      if (updatedTrainee.startDate && updatedTrainee.endDate) {
        await generateReports(updatedTrainee)
      }

      // we need to save the user and not update it
      // because we don't know what exactly changed
      // if we use update DDB would throw an error
      return saveUser(updatedTrainee)
    },
  },
}

export const adminAdminResolver: GqlResolvers<AdminContext> = {
  Mutation: {
    createAdmin: async (_parent, { input }, { currentUser }) => {
      const existingUser = await userByEmail(input.email)

      if (existingUser) {
        throw new GraphQLError(t('errors.userAlreadyExists', currentUser.language))
      }

      const newAdmin = generateAdmin(input)

      return saveUser(newAdmin)
    },
    updateAdmin: async (_parent, { input, id }, { currentUser }) => {
      const admin = (await userById(id)) as Admin

      if (!admin) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      const updatedAdmin: Admin = {
        ...admin,
        ...input,
      }

      await validateAdmin(updatedAdmin)

      // we need to save the user and not update it
      // because we don't know what exactly changed
      // if we use update DDB would throw an error
      return saveUser(updatedAdmin)
    },
  },
}
