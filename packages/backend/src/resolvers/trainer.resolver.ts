import { GraphQLError } from 'graphql'

import { GqlResolvers, TrainerContext } from '@lara/api'

import { reportByYearAndWeek } from '../repositories/report.repo'
import { allTrainees, traineeById, traineesByTrainerId } from '../repositories/trainee.repo'
import { updateUser } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'
import { avatar, username } from '../services/user.service'
import { createT } from '../i18n'
import {papersByTrainee} from "../repositories/paper.repo";

export const trainerResolver: GqlResolvers<TrainerContext> = {
  Trainer: {
    trainees: async (model) => {
      return traineesByTrainerId(model.id)
    },
    avatar,
    username,
    alexaSkillLinked,
    papers: async (model) => {
      return papersByTrainee(model.id)
    },
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

      if (!report || report.traineeId !== trainee.id) {
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
  },
}
