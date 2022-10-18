import {
  addDays,
  differenceInMilliseconds,
  isAfter,
  isBefore,
  isSameWeek,
  setISOWeek,
  setISOWeekYear,
  startOfISOWeek,
} from 'date-fns'
import { GraphQLError } from 'graphql'
import { v4 } from 'uuid'

import { Day, Entry, GqlReportStatus, Report, Trainee, Trainer, User } from '@lara/api'

import { queryObjects, reportTableName, reportTraineeIdStatusIndex } from '../db'
import { parseISODate } from '../utils/date'
import { dayMinutes, dayStatus, generateDay } from './day.service'
import { endOfToolUsage, startOfToolUsage } from './trainee.service'
import { isTrainee, isTrainer, isAdmin } from '../permissions'
import { createT, t } from '../i18n'
import { LaraConfig } from '../resolvers/config.resolver'

const sortReportsByDate = (reports: Report[]): Report[] => {
  return reports.sort((reportA, reportB) => differenceInMilliseconds(reportDate(reportA), reportDate(reportB)))
}

export const reportsWithinApprenticeship = async (
  trainee: Trainee,
  statuses?: GqlReportStatus[]
): Promise<Report[]> => {
  const reports = statuses
    ? await DANGEROUSLY_reportsForTraineeAndStatuses(trainee.id, statuses)
    : await DANGEROUSLY_reportsForTrainees(trainee.id)

  return sortReportsByDate(
    reports.filter((report) => {
      const date = reportDate(report)

      const isBeforeOrEqualEnd = isBefore(date, endOfToolUsage(trainee) || isSameWeek(date, endOfToolUsage(trainee)))

      const isAfterOrEqualStart =
        isAfter(date, startOfToolUsage(trainee)) || isSameWeek(date, startOfToolUsage(trainee))

      return isBeforeOrEqualEnd && isAfterOrEqualStart
    })
  )
}

const DANGEROUSLY_reportsForTraineeAndStatuses = async (
  traineeId: string,
  statuses: GqlReportStatus[]
): Promise<Report[]> => {
  const allReports = await Promise.all(
    statuses.map((status) => queryObjects<Report>(reportTableName, reportTraineeIdStatusIndex, { traineeId, status }))
  )

  return allReports.reduce((acc, reports) => [...acc, ...reports], [])
}

// Only use function if you need all reports from the database
// Use reportsWithinApprenticeship instead
export const DANGEROUSLY_reportsForTrainees = (traineeId: string): Promise<Report[]> => {
  return queryObjects<Report>(reportTableName, reportTraineeIdStatusIndex, { traineeId })
}

export const isReportStatus = (status: string): status is GqlReportStatus =>
  status === 'todo' || status === 'review' || status === 'reopened' || status === 'archived'

export const reportDate = (report: Pick<Report, 'year' | 'week'>): Date => {
  return parseISODate(startOfISOWeek(setISOWeek(setISOWeekYear(new Date(), report.year), report.week)))
}

export const entries = (report: Report): Entry[] =>
  report.days.reduce<Entry[]>((acc, day) => [...acc, ...day.entries], [])

export const comments = (report: Report): number => {
  const reportComments = report.comments.length
  const dayComments = report.days.reduce((acc, day) => acc + day.comments.length, 0)
  const entryComments = entries(report).reduce((acc, entry) => acc + entry.comments.length, 0)

  return reportComments + dayComments + entryComments
}

export const generateReport = (year: number, week: number, traineeId: string): Report => {
  const startDate = reportDate({ year, week })

  let days: Day[] = []

  for (let i = 0; i < 5; i++) {
    const day = generateDay(addDays(startDate, i).toISOString())

    days = [...days, day]
  }

  return {
    id: v4(),
    week,
    year,
    days,
    comments: [],
    status: 'todo',
    createdAt: new Date().toISOString(),
    traineeId,
  }
}

/**
 * Calculates finished days for report
 * @param report Report to check
 * @returns Number of finished days
 */
export const finishedDays = (report: Report): number => {
  return report.days.reduce((acc, day) => {
    switch (dayStatus(day)) {
      case 'sick':
      case 'vacation':
      case 'holiday':
        return acc + 1
      case 'education':
        if (dayMinutes(day) > LaraConfig.minEducationDayMinutes) {
          return acc + 1
        }
        break
      default:
        if (dayMinutes(day) >= LaraConfig.minWorkDayMinutes) {
          return acc + 1
        }
    }

    return 0
  }, 0)
}

/**
 * Validates a report status update for trainees
 * @param trainee Trainee that updates the report
 * @param report Report that is updated
 * @param newStatus New status of report
 */
export const validateTraineeStatusUpdate = (trainee: Trainee, report: Report, newStatus: GqlReportStatus): void => {
  const t = createT(trainee.language)

  if (report.traineeId !== trainee.id) {
    throw new GraphQLError(t('errors.missingReport'))
  }

  // Trainees can't accept reports
  if (newStatus === 'archived') {
    throw new GraphQLError(t('errors.wrongUserType'))
  }

  // Report can only send into review if it's todo or reopened
  if (newStatus === 'review' && report.status !== 'todo' && report.status !== 'reopened') {
    throw new GraphQLError(t('errors.wrongReportStatus'))
  }

  // Report can only send into review it it's finished
  if (newStatus === 'review' && (finishedDays(report) < LaraConfig.finishedWeekDayCount || !report.department)) {
    throw new GraphQLError(t('errors.reportIncomplete'))
  }

  // Report can only be reopened if archived
  if (newStatus === 'reopened' && report.status !== 'archived') {
    throw new GraphQLError(t('errors.wrongReportStatus'))
  }
}

/**
 * Validates a report status update for trainers
 * @param report Report that is updated
 * @param newStatus New status of report
 */
export const validateTrainerStatusUpdate = (trainer: Trainer, report: Report, newStatus: GqlReportStatus): void => {
  const t = createT(trainer.language)

  // Trainer can't send report into review
  if (newStatus === 'review') {
    throw new GraphQLError(t('errors.wrongUserType'))
  }

  // Report can only be reopened of archived if it's in review
  if ((newStatus === 'archived' || newStatus === 'reopened') && report.status !== 'review') {
    throw new GraphQLError(t('errors.wrongReportStatus'))
  }
}

/**
 * Validates a report status update
 * @param user User that updates the report
 * @param report Report that will be updates
 * @param newStatus New status for report
 */
export const validateStatusUpdate = (user: User, report: Report, newStatus: GqlReportStatus): void => {
  if (isTrainee(user)) {
    validateTraineeStatusUpdate(user, report, newStatus)
  }

  if (isTrainer(user)) {
    validateTrainerStatusUpdate(user, report, newStatus)
  }

  // Admin can't update reports
  if (isAdmin(user)) {
    throw new GraphQLError(t('errors.wrongUserType', user.language))
  }
}

/**
 * Checks if report can be edited or updated
 * @param report Report
 * @returns Boolean
 */
export const isReportEditable = (report: Pick<Report, 'status'>): boolean =>
  report.status === 'todo' || report.status === 'reopened'
