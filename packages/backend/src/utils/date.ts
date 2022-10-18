import { parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const parseISODateString = (date: string): Date => {
  const isoDate = parseISO(date)
  return utcToZonedTime(isoDate, 'Europe/Berlin')
}

export const parseISODate = (date: Date): Date => {
  return utcToZonedTime(date, 'Europe/Berlin')
}
