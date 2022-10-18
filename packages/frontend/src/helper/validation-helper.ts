import { addYears, isAfter, isBefore, subYears } from 'date-fns'

import { useConfigQuery } from '../graphql'
import TimeConversion from './time-conversion'
import strings from '../locales/localization'

type ValidationHelper = {
  validateStartDate: (value: string) => string | undefined
  validateEndDate: (value: string) => string | undefined
  validateTime: (value: string) => boolean
  validateDepartment: (value: string) => boolean
  validateEmail: (email: string) => boolean
}

export const useValidationHelper = (): ValidationHelper => {
  const { data } = useConfigQuery()

  const validateStartDate: ValidationHelper['validateStartDate'] = (value) => {
    if (!value) {
      return
    }

    const minStartDate = subYears(Date.now(), data?.config.maxPeriodYearsCount ?? 5)

    return isAfter(Date.parse(value), minStartDate) ? undefined : strings.validation.startDateOutOfPeriod
  }

  const validateEndDate: ValidationHelper['validateEndDate'] = (value) => {
    if (!value) {
      return
    }

    const maxEndDate = addYears(Date.now(), data?.config.maxPeriodYearsCount ?? 5)

    return isBefore(Date.parse(value), maxEndDate) ? undefined : strings.validation.endDateOutOfPeriod
  }

  const validateTime: ValidationHelper['validateTime'] = (value) => {
    if (value) {
      return TimeConversion.stringToMinutes(value) <= 600
    }

    return false
  }

  const validateDepartment: ValidationHelper['validateDepartment'] = (value) => {
    // Only counts characters
    const matchedCharacters = value.match(/[A-Za-zÖÜÄöüäß]/g)
    if (matchedCharacters === null || matchedCharacters.length < 3 || matchedCharacters.length > 62) {
      return false
    }

    return true
  }

  const validateEmail: ValidationHelper['validateEmail'] = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  return {
    validateStartDate,
    validateEndDate,
    validateTime,
    validateDepartment,
    validateEmail,
  }
}
