import { Report, Day, Entry } from '@lara/api'
import { getLaraConfig } from '../graphql/config'

type ReducedDay = Pick<Day, 'id' | 'status'> & { entries: Pick<Entry, 'time' | 'time_split'>[] }

const totalDayMinutes = (day: ReducedDay) =>
  day.entries.reduce((acc, entry) => acc + (entry.time ? entry.time : entry.time_split!), 0)

export const finishedDays = async (days: ReducedDay[]): Promise<number> => {
  const config = await getLaraConfig()

  return days.reduce((acc, day) => {
    switch (day.status) {
      case 'sick':
      case 'vacation':
      case 'holiday':
        return acc + 1
      case 'education':
        return totalDayMinutes(day) > (config?.minEducationDayMinutes ?? 0) ? acc + 1 : acc
      default:
        return totalDayMinutes(day) >= (config?.minWorkDayMinutes ?? 180) ? acc + 1 : acc
    }
  }, 0)
}

export const canSubmit = async (report: Pick<Report, 'status'> & { days: ReducedDay[] }): Promise<boolean> => {
  const config = await getLaraConfig()

  const hasCorrectStatus = isOpen(report)
  const isFinished = await finishedDays(report.days).then((dayCount) => dayCount === config?.finishedWeekDayCount)

  return hasCorrectStatus && isFinished
}

export const isOpen = (report: Pick<Report, 'status'>): boolean =>
  report.status === 'reopened' || report.status === 'todo'

export const canCreateEntry = (report: Pick<Report, 'status'>, day: Pick<Day, 'status'>): boolean => {
  const hasCorrectReportStatus = isOpen(report)
  const hasCorrectDayStatus = day.status === 'work' || day.status === 'education'

  return hasCorrectDayStatus && hasCorrectReportStatus
}
