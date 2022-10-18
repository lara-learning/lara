import {
  addWeeks,
  addYears,
  differenceInYears,
  getISOWeek,
  getISOWeekYear,
  isAfter,
  isBefore,
  isFuture,
  isPast,
  max,
  min,
  subYears,
} from 'date-fns'
import { GraphQLError } from 'graphql'
import { v4 } from 'uuid'

import { Trainee } from '@lara/api'

import { createT, t } from '../i18n'
import { deleteReports, saveReport } from '../repositories/report.repo'
import { deleteUser } from '../repositories/user.repo'
import { filterNullish } from '../utils/array'
import { parseISODateString } from '../utils/date'
import { validateCompanyId } from './company.service'
import { DANGEROUSLY_reportsForTrainees, generateReport } from './report.service'
import { LaraConfig } from '../resolvers/config.resolver'

type GenerateTraineeOptions = {
  firstName: string
  lastName: string
  email: string
  startDate?: string
  endDate?: string
  companyId?: string
  startOfToolUsage?: string
}

/**
 * Generates new trainee object.
 * Returned trainee isn't saved to the DB yet.
 * @param options Genration options
 * @returns New Trainee
 */
export const generateTrainee = async (options: GenerateTraineeOptions): Promise<Trainee> => {
  const trainee: Trainee = {
    id: v4(),
    createdAt: new Date().toISOString(),
    type: 'Trainee',
    timetableSettings: {
      onBoardingTimetable: false,
      weekendSchool: false,
      preFillClass: false,
    },
    language: 'de',
    theme: 'light',
    ...options,
  }

  await validateTrainee(trainee)

  return trainee
}

/**
 * Creates a Date by checking the DB field first and fallback
 * to either startDate or createdAt
 * @param trainee Trainee to create Date
 * @returns Date representing the start
 */
export const startOfToolUsage = (trainee: Trainee): Date => {
  if (trainee.startOfToolUsage) {
    return parseISODateString(trainee.startOfToolUsage)
  }

  const startDate = trainee.startDate ? parseISODateString(trainee.startDate) : undefined
  const createdAt = parseISODateString(trainee.createdAt)

  return max(filterNullish([startDate, createdAt]))
}

/**
 * Creates a Date that indicates the end of tool usage
 * @param trainee Trainee to create Date
 * @returns Date representing the end
 */
export const endOfToolUsage = (trainee: Trainee): Date => {
  const endDate = trainee.endDate ? parseISODateString(trainee.endDate) : undefined

  return min(filterNullish([endDate, new Date()]))
}

/**
 * Generates all missing reports and saves them to the DB
 * @param trainee Trainee to generate reports
 */
export const generateReports = async (trainee: Trainee): Promise<void> => {
  if (!trainee.startDate || !trainee.endDate) {
    throw new GraphQLError(t('errors.missingPeriod', trainee.language))
  }

  let generationDate = startOfToolUsage(trainee)
  const end = parseISODateString(trainee.endDate)

  const oldReports = await DANGEROUSLY_reportsForTrainees(trainee.id)

  while (isBefore(generationDate, end)) {
    const week = getISOWeek(generationDate)
    const year = getISOWeekYear(generationDate)
    const reportAlreadyExists = oldReports.some((report) => report.week === week && report.year === year)

    if (!reportAlreadyExists) {
      const report = generateReport(year, week, trainee.id)
      await saveReport(report)
    }

    generationDate = addWeeks(generationDate, 1)
  }
}

/**
 * Validates that the trainee attributes are all
 * correct. Throws an error if not
 * @param _trainer Trainee to validate
 */
export const validateTrainee = async (trainee: Trainee, lng?: string): Promise<void> => {
  const { startDate, endDate, companyId } = trainee

  const start = startDate && parseISODateString(startDate)
  const end = endDate && parseISODateString(endDate)

  if (companyId) {
    await validateCompanyId(companyId)
  }

  const t = createT(lng)

  if (start && isFuture(start)) {
    throw new GraphQLError(t('errors.startDateInFuture'))
  }

  if (start && isBefore(start, subYears(new Date(), LaraConfig.maxPeriodYearsCount))) {
    throw new GraphQLError(t('errors.startDateOutOfPeriod'))
  }

  if (end && isPast(end)) {
    throw new GraphQLError(t('errors.endDateInPast'))
  }

  if (end && start && isAfter(start, end)) {
    throw new GraphQLError(t('errors.endDateBeforeStartDate'))
  }

  if (end && isAfter(end, addYears(new Date(), LaraConfig.maxPeriodYearsCount))) {
    throw new GraphQLError(t('errors.endDateOutOfPeriod'))
  }

  if (start && end && differenceInYears(end, start) > LaraConfig.maxPeriodYearsCount) {
    throw new GraphQLError(t('errors.periodTooLong'))
  }
}

/**
 * Deletes a Trainee and all it's references in the DB
 * @param trainee Trainee to delete
 * @returns Boolean representing the success
 */
export const deleteTrainee = async (trainee: Trainee): Promise<boolean> => {
  const reports = await DANGEROUSLY_reportsForTrainees(trainee.id)

  const deleteReportSuccess = await deleteReports(reports)

  const deleteUserSuccess = await deleteUser(trainee)

  return deleteReportSuccess && deleteUserSuccess
}
