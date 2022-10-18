import {
  Entry,
  GqlTimetable,
  GqlTimetableEntry,
  GqlWeekday,
  Report,
  Day,
  GqlTimetableInput,
  GqlTimetableEntryInput,
} from '@lara/api'
import { areIntervalsOverlapping, getISODay, hoursToMinutes, isWithinInterval, setISODay } from 'date-fns'
import { parseISODateString } from '../utils/date'
import { v4 } from 'uuid'
import { timetablesByTrainee } from '../repositories/timetable.repo'
import { generateEntry } from './entry.service'
import { reportDate } from './report.service'

/**
 * Generates a new timetable
 * @param timetableInput Input for generation
 * @returns a new timetable
 */
export const generateTimetable = (timetableInput: GqlTimetableInput): GqlTimetable => {
  const timetable: GqlTimetable = {
    ...timetableInput,
    id: v4(),
    entries: timetableInput.entries.map((entry) => generateTimetableEntry(entry)),
  }
  return timetable
}

/**
 * Generates new entry with id
 * @param entryInput Input for generation
 * @returns a new GqlTimetableEntry
 */
export const generateTimetableEntry = (entryInput: GqlTimetableEntryInput): GqlTimetableEntry => {
  return {
    id: v4(),
    ...entryInput,
  }
}

/**
 * Returns a timetable that is overlapping with the period of the given report
 * @param traineeId
 * @param report
 * @returns GqlTimetable or undefined
 */
export const timetableByReport = async (traineeId: string, report: Report): Promise<GqlTimetable | undefined> => {
  const timetables = await timetablesByTrainee(traineeId)
  const dateOfReport = reportDate(report)

  return timetables?.find((timetable) => {
    const start = parseISODateString(timetable.dateStart)
    const end = parseISODateString(timetable.dateEnd)
    return areIntervalsOverlapping(
      { start: setISODay(dateOfReport, 1), end: setISODay(dateOfReport, 5) },
      { start, end },
      { inclusive: true }
    )
  })
}

/**
 * Fills a report with Entries of a timetable for the correct day
 * @param report
 * @param timetable
 * @returns an updated report with timetable entries added
 */
export const fillReportWithTimetable = (report: Report, timetable: GqlTimetable): Report => {
  const start = parseISODateString(timetable.dateStart)
  const end = parseISODateString(timetable.dateEnd)

  const newDays = report.days.map<Day>((day) => {
    if (!isWithinInterval(parseISODateString(day.date), { start, end })) {
      return day
    }

    const timetableEntriesOfDay = timetable.entries
      .filter((entry) => entry.day === getDayOfWeekByIndex(parseISODateString(day.date)))
      .map((entry, index) => transformTimetableEntry(entry, day.entries.length + index))

    return { ...day, status: 'education', entries: [...day.entries, ...timetableEntriesOfDay] }
  })

  return { ...report, days: newDays }
}

/**
 * Helper function to get the name of the weekday index
 * @param date Date
 * @returns GqlWeek
 */
const getDayOfWeekByIndex = (date: Date): GqlWeekday => {
  const index = getISODay(date)
  switch (index) {
    case 1:
      return 'monday'
    case 2:
      return 'tuesday'
    case 3:
      return 'wednesday'
    case 4:
      return 'thursday'
    case 5:
      return 'friday'
    case 6:
    default:
      return 'saturday'
  }
}

/**
 * Transforms an Timetable entry to an report entry
 * @param timetableEntry
 * @param orderId must be the new last orderId
 * @returns report entry
 */
const transformTimetableEntry = (timetableEntry: GqlTimetableEntry, orderId: number): Entry => {
  const hours = timetableEntry.timeEnd - timetableEntry.timeStart

  return generateEntry({ text: timetableEntry.subject, time: hoursToMinutes(hours) }, orderId)
}
