import { endOfDay, endOfISOWeek, format, setISOWeek, setYear, startOfDay, startOfISOWeek } from 'date-fns'
import { de as germanDateLocale, enUS as englishDateLocale } from 'date-fns/locale'

import strings from '../locales/localization'

class DateHelper {
  public static startOfWeek(year: number, week: number): Date {
    const baseDate = new Date()
    return startOfDay(startOfISOWeek(setISOWeek(setYear(baseDate, year), week)))
  }

  public static endOfWeek(year: number, week: number): Date {
    const baseDate = new Date()
    return endOfDay(endOfISOWeek(setISOWeek(setYear(baseDate, year), week)))
  }

  public static format(date: number | Date, schema: string): string {
    switch (strings.getLanguage()) {
      case 'en':
        return format(date, schema, { locale: englishDateLocale })
      case 'de':
      default:
        return format(date, schema, { locale: germanDateLocale })
    }
  }
}

export default DateHelper
