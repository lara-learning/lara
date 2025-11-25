import { Day, DayStatusEnum, Entry, useConfigQuery } from '../graphql'

type UseDayHelper = {
  isValidTimeUpdate: (
    day: Pick<Day, 'status'> & { entries: Pick<Entry, 'time' | 'time_split'>[] },
    newTime: number
  ) => boolean
  getTotalMinutes: (day: Pick<Day, 'status'> & { entries: Pick<Entry, 'time' | 'time_split'>[] }) => number
}

export const useDayHelper = (): UseDayHelper => {
  const { data } = useConfigQuery()

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
      maxTime = 840
    }

    return getTotalMinutes(day) + newTime <= maxTime
  }

  const getTotalMinutes: UseDayHelper['getTotalMinutes'] = (day) => {
    if (day.status === DayStatusEnum.Education || day.status === DayStatusEnum.Work) {
      return day.entries.reduce((accumulator, entry) => accumulator + (entry.time ? entry.time : entry.time_split!), 0)
    } else {
      return 0
    }
  }

  return {
    isValidTimeUpdate,
    getTotalMinutes,
  }
}
