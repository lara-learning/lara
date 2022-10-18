import { GraphQLError } from 'graphql'
import { v4 } from 'uuid'

import { Day, Entry, GqlEntryInput, Report } from '@lara/api'

import { dayMinutes, days, isHoliday } from './day.service'
import { isReportEditable } from './report.service'
import { createT } from '../i18n'
import { LaraConfig } from '../resolvers/config.resolver'

/**
 * Creates an array of all entries by the given reports
 * @param reports Reports to get entries from
 * @returns All entries of reports
 */
export const entries = (reports: Report[]): Entry[] =>
  days(reports).reduce<Entry[]>((acc, curr) => [...acc, ...curr.entries], [])

/**
 * Generates a new Entry.
 * @param input Entry input
 * @param orderId Order position in day
 * @returns New Entry
 */
export const generateEntry = (input: GqlEntryInput, orderId: number): Entry => {
  return {
    id: v4(),
    comments: [],
    createdAt: new Date().toISOString(),
    orderId,
    ...input,
  }
}

type ReportDayEntryPayload = {
  entry: Entry | undefined
  day: Day | undefined
  report: Report | undefined
}

/**
 * Collects the entry, day and report data
 * @param entryId ID of the given entry
 * @param reports Reports to search in
 * @returns Payload containing entry, day and report
 */
export const reportDayEntryByEntryId = (entryId: string, reports: Report[]): ReportDayEntryPayload => {
  let payload: ReportDayEntryPayload = { report: undefined, day: undefined, entry: undefined }

  reports.forEach((report) => {
    report.days.forEach((day) => {
      day.entries.forEach((entry) => {
        if (entry.id !== entryId) {
          return
        }

        payload = { report, day, entry }
      })
    })
  })

  return payload
}

/**
 * Validates entry update or creation
 * @param day Day that will be updated
 * @param newEntry Entry in Day
 */
export const validateEntryUpdate = (report: Report, day: Day, newEntry: Entry, language?: string): void => {
  const t = createT(language)

  if (!isReportEditable(report)) {
    throw new GraphQLError(t('errors.wrongReportStatus'))
  }

  // calculate the time without the entry that is updated
  const minutes = dayMinutes({
    ...day,
    entries: day.entries.filter((d) => d.id !== newEntry.id),
  })

  if (day.status === 'work' && minutes + newEntry.time > LaraConfig.maxWorkDayMinutes) {
    throw new GraphQLError(t('errors.dayTimeLimit'))
  }

  if (day.status === 'education' && minutes + newEntry.time > LaraConfig.maxEducationDayMinutes) {
    throw new GraphQLError(t('errors.dayTimeLimit'))
  }

  // check if day has correct status
  if (isHoliday(day) || day.status === 'holiday' || day.status === 'vacation' || day.status === 'sick') {
    throw new GraphQLError(t('errors.wrongReportStatus'))
  }
}
