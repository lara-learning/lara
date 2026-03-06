import { AuthenticatedContext, GqlLaraConfig, GqlResolvers } from '@lara/api'

import { companies } from '../repositories/company.repo'

export const LaraConfig: GqlLaraConfig = {
  minWorkDayMinutes: 180,
  maxWorkDayMinutes: 480,
  expectedWorkDayMinutes: 480,

  minEducationDayMinutes: 0,
  maxEducationDayMinutes: 480,

  maxEntryMinutes: 480,

  maxPeriodYearsCount: 5,

  finishedWeekDayCount: 5,
}

export const configResolver: GqlResolvers<AuthenticatedContext> = {
  Query: {
    companies: () => {
      return companies()
    },
    config: () => {
      return LaraConfig
    },
  },
}
