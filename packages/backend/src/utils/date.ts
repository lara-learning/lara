import { parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const parseISODateString = (date: string): Date => {
  const isoDate = parseISO(date)
  return toZonedTime(isoDate, 'Europe/Berlin')
}

export const parseISODate = (date: Date): Date => {
  return toZonedTime(date, 'Europe/Berlin')
}
