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
import { entries } from '../services/entry.service'
import { createPrintReportData, createPrintUserData, invokePrintLambda, savePrintData } from '../services/print.service'
import { reportsWithinApprenticeship } from '../services/report.service'
import { endOfToolUsage, startOfToolUsage, validateTrainee } from '../services/trainee.service'
import { avatar, username } from '../services/user.service'
import { filterNullish } from '../utils/array'
import { papersByTrainee } from '../repositories/paper.repo'

export const traineeResolver: GqlResolvers<AuthenticatedContext> = {
  Trainee: {
    reports: async (model, _args, { currentUser }) => {
      if (isTrainer(currentUser)) {
        return reportsWithinApprenticeship(model, ['review'])
      }

      return reportsWithinApprenticeship(model)
    },
    username,
    openReportsCount: async (model) => {
      return reportsWithinApprenticeship(model, ['reopened', 'todo']).then((reports) => reports.length)
    },
    papers: async (model) => {
      return papersByTrainee(model.id)
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
    avatar,
    alexaSkillLinked,
  },
  Query: {
    suggestions: async (_parent, _args, { currentUser }) => {
      const tmp: Record<string, number> = {}

      const reports = await reportsWithinApprenticeship(currentUser)
      const traineeEntries = entries(reports)

      traineeEntries.forEach(({ text }) => {
        tmp[text] = tmp[text] ? tmp[text] + 1 : 1
      })

      const sortedEntries = Object.entries(tmp).sort((a, b) => a[1] - b[1])
      return sortedEntries.filter((entry) => entry[1] >= 5).map(([text]) => text)
    },
    print: async (_parent, { ids }, { currentUser }) => {
      const reports = await Promise.all(ids.map(reportById))
      const filteredReports = filterNullish(reports)

      if (filteredReports.length === 0) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      const data = filteredReports.map((report) => createPrintReportData(report, currentUser))

      const userData = await createPrintUserData(currentUser)
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
