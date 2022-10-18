import { getDate, getISODay, getYear } from 'date-fns'

import DateHelper from '../../helper/date-helper'
import strings from '../../locales/localization'

describe('DateHelper', () => {
  test('startOfWeek returns the correct day', () => {
    const date1 = DateHelper.startOfWeek(2018, 5)
    expect(getYear(date1)).toBe(2018)
    expect(getISODay(date1)).toBe(1)
    expect(getDate(date1)).toBe(29)

    const date2 = DateHelper.startOfWeek(2019, 1)
    expect(getYear(date2)).toBe(2018)
    expect(getISODay(date2)).toBe(1)
    expect(getDate(date2)).toBe(31)

    const date3 = DateHelper.startOfWeek(2018, 52)
    expect(getYear(date3)).toBe(2018)
    expect(getISODay(date1)).toBe(1)
    expect(getDate(date3)).toBe(24)
  })
  test('endOfWeek returns the correct day', () => {
    const date1 = DateHelper.endOfWeek(2018, 5)
    expect(getYear(date1)).toBe(2018)
    expect(getISODay(date1)).toBe(7)
    expect(getDate(date1)).toBe(4)

    const date2 = DateHelper.endOfWeek(2019, 1)
    expect(getYear(date2)).toBe(2019)
    expect(getISODay(date2)).toBe(7)
    expect(getDate(date2)).toBe(6)

    const date3 = DateHelper.endOfWeek(2018, 52)
    expect(getYear(date3)).toBe(2018)
    expect(getISODay(date1)).toBe(7)
    expect(getDate(date3)).toBe(30)
  })
  test('format returns the correct locale', () => {
    const date = new Date(1997, 9, 3)
    strings.setLanguage('de')
    expect(DateHelper.format(date, 'EEEE')).toBe('Freitag')
    strings.setLanguage('en')
    expect(DateHelper.format(date, 'EEEE')).toBe('Friday')
  })
})
