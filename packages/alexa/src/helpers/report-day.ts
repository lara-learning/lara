import { getISOWeek, getISOWeekYear, isSameDay } from 'date-fns'

import { DayResponse, getReportByYearAndWeek, ReportResponse } from '../graphql/get-report'

type ReportDayPayload =
  | {
      success: true
      report: ReportResponse
      day: DayResponse
    }
  | {
      success: false
      message: string
    }

export const reportByDate = (date: string): Promise<ReportResponse | undefined> => {
  let week = 0
  let year = 0

  const regex = /(\d{4})-W(\d{1,2})/
  if (regex.test(date)) {
    // if a week is specified the date string looks like this: '2015-W49'
    // so we need to extract the year and the week
    const match = regex.exec(date)

    year = Number(match?.[1])
    week = Number(match?.[2])
  } else {
    const entryDate = new Date(date)

    week = getISOWeek(entryDate)
    year = getISOWeekYear(entryDate)
  }

  return getReportByYearAndWeek(year, week)
}

export const reportDayByDate = async (date: string): Promise<ReportDayPayload> => {
  const entryDate = new Date(date)

  const report = await reportByDate(date)

  if (!report) {
    return {
      success: false,
      message: 'Das Berichtsheft konnte nicht gefunden werden. Bitte gebe einen anderen Tag ein.',
    }
  }

  const day = entryDate
    ? report.days.find((day) => entryDate && isSameDay(new Date(day.date), entryDate))
    : report.days[0]

  if (!day) {
    return {
      success: false,
      message: 'Der Tag konnte nicht gefunden werden. Bitte gebe einen anderen Tag ein.',
    }
  }

  return {
    success: true,
    day,
    report,
  }
}
