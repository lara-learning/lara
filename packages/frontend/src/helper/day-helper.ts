import { Day, DayStatusEnum, Entry, useConfigQuery } from '../graphql'

type DayPick = Pick<Day, 'status' | 'status_split'>
type EntryPick = Pick<Entry, 'time' | 'time_split'>

type UseDayHelper = {
  isValidTimeUpdate: (day: DayPick & { entries: EntryPick[] }, newTime: number) => boolean
  getTotalMinutes: (day: DayPick & { entries: EntryPick[] }, oooValue?: boolean) => number
}

export const useDayHelper = (): UseDayHelper => {
  const { data } = useConfigQuery()

  const isOOO = (status?: DayStatusEnum) =>
    status === DayStatusEnum.Sick || status === DayStatusEnum.Vacation || status === DayStatusEnum.Holiday

  const isValidTimeUpdate: UseDayHelper['isValidTimeUpdate'] = (day, newTime) => {
    let maxTime: number | undefined

    switch (day.status) {
      case DayStatusEnum.Work:
        maxTime = data?.config.maxWorkDayMinutes
        break
      case DayStatusEnum.Education:
        maxTime = data?.config.maxEducationDayMinutes
        break
    }

    if (!maxTime) {
      maxTime = 480
    }

    return getTotalMinutes(day, true) + newTime <= maxTime
  }

  const getTotalMinutes: UseDayHelper['getTotalMinutes'] = (day, ignoreSplitOOO?) => {
    if (isOOO(day.status_split)) {
      if (ignoreSplitOOO) return 0
      if (!data?.config) return 480
      return day.status === 'education' ? data.config.minEducationDayMinutes : data.config.minWorkDayMinutes
    }

    if (day.status === DayStatusEnum.Education || day.status === DayStatusEnum.Work) {
      return day.entries.reduce((accumulator, entry) => accumulator + (entry.time ?? 0) + (entry.time_split ?? 0), 0)
    } else {
      return data?.config.minWorkDayMinutes ?? 480
    }
  }

  return {
    isValidTimeUpdate,
    getTotalMinutes,
  }
}
