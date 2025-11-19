import { GraphQLError } from 'graphql'

import { GqlResolvers, TrainerContext } from '@lara/api'

import { reportByYearAndWeek } from '../repositories/report.repo'
import { allTrainees, traineeById, traineesByTrainerId } from '../repositories/trainee.repo'
import { updateUser, userById } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'
import { createT } from '../i18n'
import { addMonths } from 'date-fns'
import { isTrainee } from '../permissions'
import { sendDeletionMail } from '../services/email.service'

export const trainerResolver: GqlResolvers<TrainerContext> = {
  Trainer: {
    trainees: async (model) => {
      return traineesByTrainerId(model.id)
    },
    alexaSkillLinked,
  },
  Query: {
    trainees: allTrainees,
    reportForTrainee: async (_parent, { id, week, year }, { currentUser }) => {
      const trainee = await traineeById(id)
      const t = createT(currentUser.language)

      if (!trainee) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      if (trainee.trainerId !== currentUser.id) {
        throw new GraphQLError(t('errors.userNotClaimed'))
      }

      const report = await reportByYearAndWeek(year, week, trainee.id)

      const reportCleaned = report
        ? {
            ...report,
            comments: report?.comments.map((com) => {
              if (com.published == null) com.published = true
              if (com.published === false) {
                return com
              } else {
                return {
                  ...com,
                  published: true,
                }
              }
            }),
            days: report?.days.map((day) => ({
              ...day,
              entries: day.entries.map((entry) => ({
                ...entry,
                comments: entry.comments.map((com) => {
                  if (com.published === false) {
                    return com
                  } else {
                    return {
                      ...com,
                      published: true,
                    }
                  }
                }),
              })),
              comments: day.comments.map((com) => {
                if (com.published === false) {
                  return com
                } else {
                  return {
                    ...com,
                    published: true,
                  }
                }
              }),
            })),
          }
        : undefined

      if (!reportCleaned || reportCleaned.traineeId !== trainee.id) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      return report
    },
  },
  Mutation: {
    claimTrainee: async (_parent, { id }, { currentUser }) => {
      const trainee = await traineeById(id)

      const t = createT(currentUser.language)
      if (!trainee) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      if (trainee.trainerId) {
        throw new GraphQLError(t('errors.userAlreadyClaimed'))
      }

      return {
        trainee: await updateUser({ ...trainee, trainerId: currentUser.id }, { updateKeys: ['trainerId'] }),
        trainer: currentUser,
      }
    },
    unclaimTrainee: async (_parent, { id }, { currentUser }) => {
      const trainee = await traineeById(id)
      const t = createT(currentUser.language)

      if (!trainee) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      if (!trainee.trainerId) {
        throw new GraphQLError(t('errors.userNotClaimed'))
      }

      if (trainee.trainerId !== currentUser.id) {
        throw new GraphQLError(t('errors.userNotClaimed'))
      }

      return {
        trainee: await updateUser(trainee, { removeKeys: ['trainerId'] }),
        trainer: currentUser,
      }
    },

    trainerMarkUserForDeletion: async (_parent, { id }, { currentUser }) => {
      const user = await userById(id)
      const t = createT(currentUser.language)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      if (user.id === currentUser.id) {
        throw new GraphQLError(t('errors.cantDeleteYourself'))
      }

      if (!isTrainee(user)) {
        throw new GraphQLError(t('errors.insufficientPermissions'))
      }

      // // Prüfe ob der Trainer der Trainer des Trainees ist
      // if (user.trainerId !== currentUser.id) {
      //   throw new GraphQLError(t('errors.cantDeleteOtherTrainersTrainee'))
      // }

      user.deleteAt = addMonths(new Date(), 3).toISOString()

      await updateUser(user, { updateKeys: ['deleteAt'] })

      await sendDeletionMail(user)

      return user
    },

    trainerUnMarkUserForDeletion: async (_parent, { id }, { currentUser }) => {
      const user = await userById(id)
      const t = createT(currentUser.language)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      if (!isTrainee(user)) {
        throw new GraphQLError(t('errors.insufficientPermissions'))
      }

      // // Prüfe ob der Trainer der Trainer des Trainees ist
      // if (user.trainerId !== currentUser.id) {
      //   throw new GraphQLError(t('errors.cantUnmarkOtherTrainersTrainee'))
      // }

      return updateUser(user, { removeKeys: ['deleteAt'] })
    },
  },
}
