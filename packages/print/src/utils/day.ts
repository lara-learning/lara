import { PrintDayStatusEnum, PrintTranslations } from '@lara/api'

export const statusToString = (status: PrintDayStatusEnum, i18n: PrintTranslations): string => {
  switch (status) {
    case 'holiday':
      return i18n.holiday
    case 'sick':
      return i18n.sick
    case 'vacation':
      return i18n.vacation
    case 'work':
      return i18n.work
    case 'education':
      return i18n.education
  }

  return ''
}

export const weekdayMapping = (i18n: PrintTranslations): Record<number, string> => {
  return {
    0: i18n.monday,
    1: i18n.tuesday,
    2: i18n.wednesday,
    3: i18n.thursday,
    4: i18n.friday,
  }
}
