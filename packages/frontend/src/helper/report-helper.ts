import { DefaultTheme } from '@lara/components'

import { Day, DayStatusEnum, Entry, ReportStatus, useConfigQuery } from '../graphql'
import { useDayHelper } from './day-helper'

type UseReportHelper = {
  getFinishedDays: (report: { days: (Pick<Day, 'status'> & { entries: Pick<Entry, 'time'>[] })[] }) => number
  getProgress: (report: { days: (Pick<Day, 'status'> & { entries: Pick<Entry, 'time'>[] })[] }, value: number) => number
  getStatusColor: (reportStatus: ReportStatus) => keyof DefaultTheme
  getTotalMinutes: (report: { days: (Pick<Day, 'status'> & { entries: Pick<Entry, 'time'>[] })[] }) => number
}

const TraineeReportStatusColors: Record<ReportStatus, keyof DefaultTheme> = {
  archived: 'successGreen',
  reopened: 'errorRed',
  review: 'mediumFont',
  todo: 'iconBlue',
}

export const useReportHelper = (): UseReportHelper => {
  const { data } = useConfigQuery()
  const { getTotalMinutes: getTotalDayMinutes } = useDayHelper()

  const getStatusColor: UseReportHelper['getStatusColor'] = (reportStatus) => TraineeReportStatusColors[reportStatus]

  const getFinishedDays: UseReportHelper['getFinishedDays'] = (report) => {
    let finishedDays = 0

    const minEducationMinutes = data?.config.minEducationDayMinutes ?? 0
    const minWorkMinutes = data?.config.minWorkDayMinutes ?? 180

    report.days.forEach((day) => {
      switch (day.status) {
        case DayStatusEnum.Sick:
        case DayStatusEnum.Vacation:
        case DayStatusEnum.Holiday:
          finishedDays++
          break
        case DayStatusEnum.Education:
          if (getTotalDayMinutes(day) > minEducationMinutes) {
            finishedDays++
          }
          break
        default:
          if (getTotalDayMinutes(day) >= minWorkMinutes) {
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
    return report.days.reduce((accumulator, day) => accumulator + getTotalDayMinutes(day), 0)
  }

  return {
    getStatusColor,
    getFinishedDays,
    getProgress,
    getTotalMinutes,
  }
}
