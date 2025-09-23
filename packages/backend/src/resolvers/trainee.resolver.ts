import { GraphQLError } from 'graphql'

import {
  AuthenticatedContext,
  EmailTranslations,
  GqlResolvers,
  PrintTranslations,
  Trainee,
  TraineeContext,
} from '@lara/api'

import { t } from '../i18n'
import { isTrainer } from '../permissions'
import { reportById } from '../repositories/report.repo'
import { saveUser, userById } from '../repositories/user.repo'
import { alexaSkillLinked } from '../services/alexa.service'
import { company } from '../services/company.service'
import { createPrintReportData, createPrintUserData, invokePrintLambda, savePrintData } from '../services/print.service'
import { reportsWithinApprenticeship } from '../services/report.service'
import { endOfToolUsage, startOfToolUsage, validateTrainee } from '../services/trainee.service'
import { filterNullish } from '../utils/array'

export const traineeResolver: GqlResolvers<AuthenticatedContext> = {
  Trainee: {
    reports: async (model, _args, { currentUser }) => {
      if (isTrainer(currentUser)) {
        return reportsWithinApprenticeship(model, ['review'])
      }

      return reportsWithinApprenticeship(model)
    },
    openReportsCount: async (model) => {
      return reportsWithinApprenticeship(model, ['reopened', 'todo']).then((reports) => reports.length)
    },
  },
}

export const traineeTraineeResolver: GqlResolvers<TraineeContext> = {
  Trainee: {
    trainer: (model) => {
      if (!model.trainerId) {
        return
      }

      return userById(model.trainerId)
    },
    company: async (model) => {
      return company(model.companyId)
    },
    startOfToolUsage: (model) => startOfToolUsage(model).toISOString(),
    endOfToolUsage: (model) => endOfToolUsage(model).toISOString(),
    alexaSkillLinked,
  },
  Query: {
    suggestions: async (_parent, _args, { currentUser }) => {
      const textCountsWithTime = {} as Record<string, { count: number; duration: number; text: string }>

      function convertToHours(minutes: number) {
        const hours = Math.floor(minutes / 60)
        return hours
      }

      const reports = await reportsWithinApprenticeship(currentUser)

      reports.forEach((report) => {
        report.days.forEach((day) => {
          day.entries.forEach((entry) => {
            const { text, time } = entry

            if (!textCountsWithTime[text]) {
              textCountsWithTime[text] = { count: 0, duration: time, text: text }
            }
            textCountsWithTime[text].count += 1
            textCountsWithTime[text].duration = time
          })
        })
      })

      const getFrequentTexts = () => {
        return Object.entries(textCountsWithTime)
          .filter(([_, data]) => data.count > 5)
          .reduce(
            (accumulator, [text, data]) => {
              accumulator[text] = data
              return accumulator
            },
            {} as Record<string, { count: number; duration: number; text: string }>
          )
      }

      const frequentTexts = getFrequentTexts()

      const sugg = Object.entries(frequentTexts).map(([text, data]) => {
        const duration = convertToHours(data.duration)
        return {
          text,
          time: duration.toString(),
        }
      })

      return sugg
    },
    print: async (_parent, { ids }, { currentUser }) => {
      const reports = await Promise.all(ids.map(reportById))
      const filteredReports = filterNullish(reports)

      if (filteredReports.length === 0) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      const reportsData = filteredReports.map((report) => createPrintReportData(report, currentUser))

      const userData = await createPrintUserData(currentUser)
      const printTranslations = t<PrintTranslations>('print', currentUser.language)
      const emailTranslations = t<EmailTranslations>('email', currentUser.language)

      const hash = await savePrintData({
        reportsData,
        userData,
        printTranslations,
        emailTranslations,
      })

      await invokePrintLambda({
        printDataHash: hash,
      })

      return {
        estimatedWaitingTime: Math.round(ids.length * 1.5 + 5),
      }
    },
  },
  Mutation: {
    updateCurrentTrainee: async (_parent, { input }, { currentUser }) => {
      const updatedTrainee: Trainee = {
        ...currentUser,
        ...input,
      }

      await validateTrainee(updatedTrainee, currentUser.language)

      return saveUser(updatedTrainee)
    },
  },
}
