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
    updateDay: async (_parent, { id, status }, { currentUser }) => {
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

      if (!status || !isDayStatus(status) || status === 'holiday') {
        throw new GraphQLError(t('errors.wrongDayStatus'))
      }

      if (status === 'vacation' || status === 'sick') {
        day.entries = []
      }

      day.status = status

      await updateReport(report, { updateKeys: ['days'] })

      return day
    },
  },
}
