import {
  getISOWeek,
  getISOWeekYear,
  isAfter,
  isBefore,
  nextMonday,
  previousFriday,
  setISOWeek,
  setISOWeekYear,
} from 'date-fns'
import { GraphQLError } from 'graphql'

import { AuthenticatedContext, GqlResolvers, Report, Trainee, TraineeContext } from '@lara/api'

import { isTrainee, isTrainer } from '../permissions'
import { reportById, reportByYearAndWeek, saveReport, updateReport } from '../repositories/report.repo'
import { traineeByReportId } from '../repositories/trainee.repo'
import { sendNotificationMail } from '../services/email.service'
import {
  isReportStatus,
  reportDate,
  reportsWithinApprenticeship,
  validateStatusUpdate,
} from '../services/report.service'
import { endOfToolUsage, generateReports, startOfToolUsage } from '../services/trainee.service'
import { createT } from '../i18n'

const { IS_OFFLINE } = process.env

export const reportTraineeResolver: GqlResolvers<TraineeContext> = {
  Report: {
    nextReportLink: (report, _, { currentUser }) => {
      const nextWeek = nextMonday(reportDate(report))
      const hasNoNextWeek = isAfter(nextWeek, endOfToolUsage(currentUser))

      if (hasNoNextWeek) {
        return
      }

      return `/report/${getISOWeekYear(nextWeek)}/${getISOWeek(nextWeek)}`
    },
    previousReportLink: (report, _, { currentUser }) => {
      const prevWeek = previousFriday(reportDate(report))
      const hasNoPrevWeek = isBefore(prevWeek, startOfToolUsage(currentUser))

      if (hasNoPrevWeek) {
        return
      }

      return `/report/${getISOWeekYear(prevWeek)}/${getISOWeek(prevWeek)}`
    },
  },
  Query: {
    reports: async (_parent, { statuses }, { currentUser }) => {
      // Generate reports if executed local
      if (IS_OFFLINE) {
        await generateReports(currentUser)
      }

      return reportsWithinApprenticeship(currentUser, statuses)
    },
    reportForYearAndWeek: async (_parent, { week, year }, { currentUser }) => {
      let report = await reportByYearAndWeek(year, week, currentUser.id)

      if (report && !report.department) {
        const previousDate = previousFriday(setISOWeekYear(setISOWeek(new Date(), week), year))
        const previousReport = await reportByYearAndWeek(
          getISOWeekYear(previousDate),
          getISOWeek(previousDate),
          currentUser.id
        )

        report = previousReport?.department
          ? await updateReport({ ...report, department: previousReport?.department }, { updateKeys: ['department'] })
          : report
      }

      return report
    },
  },
}

export const reportResolver: GqlResolvers<AuthenticatedContext> = {
  Mutation: {
    updateReport: async (_parent, { id, department, status: newStatus, summary }, { currentUser }) => {
      let report: Report | undefined
      let trainee: Trainee | undefined

      const t = createT(currentUser.language)

      const currentUserIsTrainee = isTrainee(currentUser)
      if (currentUserIsTrainee) {
        report = await reportById(id)
        trainee = currentUser
      }

      const currentUserIsTrainer = isTrainer(currentUser)
      if (currentUserIsTrainer) {
        trainee = await traineeByReportId(id)

        if (trainee?.trainerId !== currentUser.id) {
          throw new GraphQLError(t('errors.userNotClaimed'))
        }

        report = await reportById(id)
      }

      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      if (!trainee) {
        throw new GraphQLError(t('errors.missingUser'))
      }

      // Prevents Trainers from updating any fields
      if (currentUserIsTrainee) {
        report.department = department
        report.summary = summary
      }

      if (newStatus && report.status !== newStatus) {
        if (!isReportStatus(newStatus) || newStatus === 'todo') {
          throw new GraphQLError(t('errors.wrongReportStatus'))
        }

        validateStatusUpdate(currentUser, report, newStatus)

        if (newStatus === 'archived') {
          report.reportAccepted = new Date().toISOString()
        }

        report.status = newStatus
      }

      await saveReport(report)

      await sendNotificationMail(report, currentUser)

      return { report, trainee }
    },
  },
}
