import { GraphQLError } from 'graphql'

import { AuthenticatedContext, GqlResolvers, TraineeContext } from '@lara/api'

import { updateReport } from '../repositories/report.repo'
import { dayStatus, isDayStatus, isHoliday, reportDayByDayId } from '../services/day.service'
import { isReportEditable, reportsWithinApprenticeship } from '../services/report.service'
import { createT } from '../i18n'

export const dayResolver: GqlResolvers<AuthenticatedContext> = {
  Day: {
    status: dayStatus,
  },
}

export const dayTraineeResolver: GqlResolvers<TraineeContext> = {
  Mutation: {
    updateDay: async (_parent, { id, status, status_split }, { currentUser }) => {
      const reports = await reportsWithinApprenticeship(currentUser)

      const { report, day } = reportDayByDayId(id, reports)

      const t = createT(currentUser.language)
      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      if (!isReportEditable(report)) {
        throw new GraphQLError(t('errors.wrongReportStatus'))
      }

      if (!day) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      if (isHoliday(day)) {
        throw new GraphQLError(t('errors.wrongDayStatus'))
      }

      if (status && isDayStatus(status)) day.status = status

      if (status === 'vacation' || status === 'sick') {
        day.entries = []
      }

      if (status_split && isDayStatus(status_split)) day.status_split = status_split

      await updateReport(report, { updateKeys: ['days'] })

      return day
    },
  },
}
