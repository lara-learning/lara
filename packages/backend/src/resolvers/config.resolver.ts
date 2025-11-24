import { AuthenticatedContext, GqlLaraConfig, GqlResolvers } from '@lara/api'

import { companies } from '../repositories/company.repo'

export const LaraConfig: GqlLaraConfig = {
  minWorkDayMinutes: 180,
  maxWorkDayMinutes: 600,
  expectedWorkDayMinutes: 480,

  minEducationDayMinutes: 0,
  maxEducationDayMinutes: 600,

  maxEntryMinutes: 600,

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
