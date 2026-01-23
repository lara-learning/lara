import { DefaultTheme } from '@lara/components'

import { Day, DayStatusEnum, Entry, ReportStatus, useConfigQuery } from '../graphql'

type ReportDay = Pick<Day, 'status'> & {
  entries: Pick<Entry, 'time' | 'time_split'>[]
}

type UseReportHelper = {
  getFinishedDays: (report: { days: ReportDay[] }) => number
  getProgress: (report: { days: ReportDay[] }, value: number) => number
  getStatusColor: (reportStatus: ReportStatus) => keyof DefaultTheme
  getTotalMinutes: (report: { days: ReportDay[] }) => number
}

const TraineeReportStatusColors: Record<ReportStatus, keyof DefaultTheme> = {
  archived: 'successGreen',
  reopened: 'errorRed',
  review: 'reviewGrey',
  todo: 'iconBlue',
}

export const useReportHelper = (): UseReportHelper => {
  const { data } = useConfigQuery()

  const getStatusColor: UseReportHelper['getStatusColor'] = (reportStatus) => TraineeReportStatusColors[reportStatus]

  const getDayMinutes = (day: ReportDay): number =>
    day.entries.reduce((acc, entry) => acc + (entry.time ?? entry.time_split ?? 0), 0)

  const getFinishedDays: UseReportHelper['getFinishedDays'] = (report) => {
    let finishedDays = 0

    const minEducationMinutes = data?.config.minEducationDayMinutes ?? 0
    const minWorkMinutes = data?.config.minWorkDayMinutes ?? 180

    report.days.forEach((day) => {
      const minutes = getDayMinutes(day)

      switch (day.status) {
        case DayStatusEnum.Sick:
        case DayStatusEnum.Vacation:
        case DayStatusEnum.Holiday:
          finishedDays++
          break
        case DayStatusEnum.Education:
          if (minutes > minEducationMinutes) {
            finishedDays++
          }
          break
        default:
          if (minutes >= minWorkMinutes) {
            finishedDays++
          }
          break
      }
    })

    return finishedDays
  }

  const getProgress: UseReportHelper['getProgress'] = (report, value) => {
    const done = value || getFinishedDays(report)
    const finishedWeekDayCount = data?.config.finishedWeekDayCount ?? 5

    return (done / finishedWeekDayCount) * 100
  }

  const getTotalMinutes: UseReportHelper['getTotalMinutes'] = (report) => {
    return report.days.reduce((accumulator, day) => accumulator + getDayMinutes(day), 0)
  }

  return {
    getStatusColor,
    getFinishedDays,
    getProgress,
    getTotalMinutes,
  }
}
