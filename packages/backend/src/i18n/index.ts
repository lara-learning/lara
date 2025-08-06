import i18next, { TOptions } from 'i18next'
import { EmailTranslations, PrintTranslations } from '@lara/api'

import { GermanTranslations } from './de'
import { EnglishTranslations } from './en'

export type Translations = {
  errors: {
    startDateInFuture: string
    startDateOutOfPeriod: string
    endDateInPast: string
    endDateBeforeStartDate: string
    endDateOutOfPeriod: string
    periodTooLong: string
    missingTokens: string
    missingUser: string
    missingReport: string
    missingDay: string
    missingEntry: string
    wrongReportStatus: string
    wrongDayStatus: string
    userAlreadyExists: string
    userNotClaimed: string
    userAlreadyClaimed: string
    dayTimeLimit: string
    missingStartDate: string
    missingCommentable: string
    wrongUserType: string
    reportIncomplete: string
    missingPeriod: string
  }
  email: EmailTranslations
  print: PrintTranslations
}

i18next.init({
  returnObjects: true,
  fallbackLng: 'de',
  resources: {
    de: {
      translation: GermanTranslations,
    },
    en: {
      translation: EnglishTranslations,
    },
  },
})

export type TFunction =  <TResult = string | object>(
  key: string,
  lng?: string,
  params?: TOptions
) => TResult


export const t = <TResult = string | object>(key: string, lng?: string, params?: TOptions): TResult => {
  return i18next.t(key, { lng: lng ?? 'de', ...params }) as unknown as TResult
}


type SimpleTFuntion = <TResult = string | object> (key: string, params?: TOptions) => TResult

export const createT = (lng?: string): SimpleTFuntion => {
  return (key, params) => t(key, lng, params)
}
