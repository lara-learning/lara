import Holidays from 'date-holidays'
import { v4 } from 'uuid'

import { Day, GqlDayStatusEnum, Report } from '@lara/api'

import { parseISODateString } from '../utils/date'

/**
 * Creates an array of all days by the given reports
 * @param reports Reports to get days from
 * @returns All days of reports
 */
export const days = (reports: Report[]): Day[] => {
  return reports.reduce<Day[]>((acc, report) => [...acc, ...report.days], [])
}

const hd = new Holidays('DE', 'HH', { types: ['public'] })

/**
 * Checks if the given day is a public holiday
 * @param day Day to check
 * @returns boolean
 */
export const isHoliday = (day: Day): boolean => {
  const result = hd.isHoliday(parseISODateString(day.date))

  return result && result.length > 0
}

/**
 * Type guard that checks if a string is a day status
 * @param status Any string
 * @returns boolean indicating if string is status
 */
export const isDayStatus = (status: string): status is GqlDayStatusEnum =>
  status === 'work' || status === 'vacation' || status === 'sick' || status === 'education' || status === 'holiday'

/**
 * Gets the status of the day
 * @param day Day to get status from
 * @returns Status of day
 */
export const dayStatus = (day: Day): GqlDayStatusEnum => {
  if (isHoliday(day)) {
    return 'holiday'
  }

  return day.status || 'work'
}

/**
 * Generates a new Day.
 * @param date Date of the day
 * @returns New day
 */
export const generateDay = (date: string): Day => ({
  id: v4(),
  comments: [],
  entries: [],
  status: 'work',
  createdAt: new Date().toISOString(),
  date,
})

type ReportDayPayload = {
  day: Day | undefined
  report: Report | undefined
}

/**
 * Collects the day and report data
 * @param dayId ID of the given day
 * @param reports Reports to search in
 * @returns Payload containing day and report
 */
export const reportDayByDayId = (dayId: string, reports: Report[]): ReportDayPayload => {
  let payload: ReportDayPayload = { day: undefined, report: undefined }

  reports.forEach((report) => {
    report.days.forEach((day) => {
      if (day.id !== dayId) {
        return
      }

      payload = { day, report }
    })
  })

  return payload
}

/**
 * Calculates the minutes of the day
 * @param day Day to calculate minutes
 * @returns Minutes of day
 */
export const dayMinutes = (day: Day): number => {
  const status = dayStatus(day)

  if (status === 'education' || status === 'work') {
    return day.entries.reduce((accumulator, entry) => accumulator + (entry.time ? entry.time : entry.time_split!), 0)
  } else {
    return 0
  }
}
