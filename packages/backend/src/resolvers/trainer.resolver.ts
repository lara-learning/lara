import { GraphQLError } from 'graphql'

import { EmailTranslations, GqlResolvers, Mentor, PrintTranslations, Trainee, Trainer, TrainerContext } from '@lara/api'

import { reportByYearAndWeek } from '../repositories/report.repo'
import { allTrainees, traineeById, traineesByTrainerId } from '../repositories/trainee.repo'
import { updateUser } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'
import { createT, t } from '../i18n'
import { paperById, papersByMentor, papersByTrainer } from '../repositories/paper.repo'
import {
  createPrintPaperData,
  createPrintUserData,
  getPrintData,
  invokePrintLambdaResponse,
  savePrintData,
} from '../services/print.service'
import { mentorById } from '../repositories/mentor.repo'
import { trainerById } from '../repositories/trainer.repo'

export const trainerResolver: GqlResolvers<TrainerContext> = {
  Trainer: {
    trainees: async (model) => {
      return traineesByTrainerId(model.id)
    },
    alexaSkillLinked,
    papers: async (model) => {
      const trainerPapers = await papersByTrainer(model.id)
      if (trainerPapers?.length) {
        const mentorPapers = await papersByMentor(model.id)
        if (mentorPapers?.length) {
          return [...trainerPapers, ...mentorPapers]
        }
      } else {
        return await papersByMentor(model.id)
      }
      return trainerPapers
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
    printPaper: async (_parent, { ids, userType }, { currentUser }) => {
      const paper = await paperById(ids[0])
      const data = []
      let trainee: Trainee | undefined
      let mentor: Mentor | Trainer | undefined
      if (paper) {
        data.push(createPrintPaperData(paper))
        trainee = await traineeById(paper?.traineeId)
        mentor = (await mentorById(paper?.mentorId)) ?? (await trainerById(paper?.mentorId))
      }

      let userData = await createPrintUserData(trainee!)
      const printTranslations: PrintTranslations = t('print', currentUser.language)
      const emailTranslations: EmailTranslations = t('email', currentUser.language)

      const traineeHash = await savePrintData({
        data,
        userData,
        printTranslations,
        emailTranslations,
      })

      const filenameTrainee = await invokePrintLambdaResponse({
        printDataHash: traineeHash,
        action: 'pageLoad',
      })

      const traineeURL = await getPrintData(filenameTrainee?.filename ?? '')

      userData = await createPrintUserData(mentor!)

      const mentorHash = await savePrintData({
        data,
        userData,
        printTranslations,
        emailTranslations,
      })

      const filenameMentor = await invokePrintLambdaResponse({
        printDataHash: mentorHash,
        action: 'pageLoad',
      })

      const mentorURL = await getPrintData(filenameMentor?.filename ?? '')

      userData = await createPrintUserData(currentUser)

      const trainerHash = await savePrintData({
        data,
        userData,
        printTranslations,
        emailTranslations,
      })

      const filenameTrainer = await invokePrintLambdaResponse({
        printDataHash: trainerHash,
        action: 'download',
      })

      const trainerURL = await getPrintData(filenameTrainer?.filename ?? '')

      const url = userType === 'Trainee' ? traineeURL : userType === 'Trainer' ? trainerURL : mentorURL

      return {
        estimatedWaitingTime: Math.round(1.5 + 5),
        pdfUrl: url,
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
