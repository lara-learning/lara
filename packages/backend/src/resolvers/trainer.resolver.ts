import { GraphQLError } from 'graphql'

import {
  EmailTranslations,
  GqlResolvers,
  PrintTranslations, Trainee,
  TrainerContext
} from '@lara/api'

import { reportByYearAndWeek } from '../repositories/report.repo'
import { allTrainees, traineeById, traineesByTrainerId } from '../repositories/trainee.repo'
import { updateUser } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'
import { avatar, username } from '../services/user.service'
import {createT, t} from '../i18n'
import {paperById, papersByTrainer} from "../repositories/paper.repo";
import {
  createPrintPaperData,
  createPrintUserData, invokePrintLambda, savePrintData
} from "../services/print.service";

export const trainerResolver: GqlResolvers<TrainerContext> = {
  Trainer: {
    trainees: async (model) => {
      return traineesByTrainerId(model.id)
    },
    avatar,
    username,
    alexaSkillLinked,
    papers: async (model) => {
      return papersByTrainer(model.id)
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
    printPaper: async (_parent, { id }, { currentUser }) => {
      const paper = await paperById(id)
      const data = []
      let trainee: Trainee | undefined;
      if(paper){
        data.push(createPrintPaperData(paper))
        trainee = await traineeById(paper?.traineeId)
      }
      console.log("testerrr")
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userData = await createPrintUserData(trainee!)
      const printTranslations: PrintTranslations = t('print', currentUser.language)
      const emailTranslations: EmailTranslations = t('email', currentUser.language)

      const hash = await savePrintData({
        data,
        userData,
        printTranslations,
        emailTranslations,
      })

      await invokePrintLambda({
        printDataHash: hash,
      })

      return {
        estimatedWaitingTime: Math.round(1.5 + 5),
      }
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
