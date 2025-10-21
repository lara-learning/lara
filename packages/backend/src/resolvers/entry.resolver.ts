import { GraphQLError } from 'graphql'

import { GqlResolvers, TraineeContext } from '@lara/api'

import { updateReport } from '../repositories/report.repo'
import { reportDayByDayId } from '../services/day.service'
import { generateEntry, reportDayEntryByEntryId, validateEntryUpdate } from '../services/entry.service'
import { isReportEditable, reportsWithinApprenticeship } from '../services/report.service'
import { createT } from '../i18n'

const tmp: Record<string, number> = {}

export const entryTraineeResolver: GqlResolvers<TraineeContext> = {
  Mutation: {
    createEntry: async (_parent, { dayId, input }, { currentUser }) => {
      const reports = await reportsWithinApprenticeship(currentUser)
      reports.forEach((report) => {
        report.days.forEach((day) => {
          day.entries.forEach((entry) => {
            const text = entry.text
            tmp[text ? text : entry.text_split!] = tmp[text ? text : entry.text_split!]
              ? tmp[text ? text : entry.text_split!] + 1
              : 1
          })
        })
      })

      const { report, day } = reportDayByDayId(dayId, reports)

      const t = createT(currentUser.language)
      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      if (!day) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      const entry = generateEntry(input, day.entries.length)

      validateEntryUpdate(report, day, entry, currentUser.language)

      day.entries = [...day.entries, entry]

      await updateReport(report, { updateKeys: ['days'] })

      return {
        day,
        report,
        entry,
      }
    },
    deleteEntry: async (_parent, { id: entryId }, { currentUser }) => {
      const reports = await reportsWithinApprenticeship(currentUser)

      const { entry, report, day } = reportDayEntryByEntryId(entryId, reports)

      const t = createT(currentUser.language)
      if (!day) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      if (!entry) {
        throw new GraphQLError(t('errors.missingEntry'))
      }

      validateEntryUpdate(report, day, entry, currentUser.language)

      day.entries = day.entries.filter(({ id }) => entry.id !== id)

      await updateReport(report, { updateKeys: ['days'] })

      return {
        day,
        report,
      }
    },
    updateEntry: async (_parent, { id, input }, { currentUser }) => {
      const reports = await reportsWithinApprenticeship(currentUser)

      const { entry, report, day } = reportDayEntryByEntryId(id, reports)

      const t = createT(currentUser.language)
      if (!entry) {
        throw new GraphQLError(t('errors.missingEntry'))
      }

      if (!day) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      validateEntryUpdate(report, day, entry, currentUser.language)

      entry.text = input.text
      entry.time = input.time
      entry.text_split = input.text_split
      entry.time_split = input.time_split

      await updateReport(report, { updateKeys: ['days'] })

      return {
        report,
        day,
        entry,
      }
    },
    updateEntryOrder: async (_parent, { dayId, entryId, orderId }, { currentUser }) => {
      const reports = await reportsWithinApprenticeship(currentUser)

      const { entry: movedEntry, report, day: fromDay } = reportDayEntryByEntryId(entryId, reports)

      const t = createT(currentUser.language)
      if (!movedEntry) {
        throw new GraphQLError(t('errors.missingEntry'))
      }

      if (!fromDay) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      if (!report) {
        throw new GraphQLError(t('errors.missingReport'))
      }

      if (!isReportEditable(report)) {
        throw new GraphQLError(t('errors.wrongReportStatus'))
      }

      const toDay = report.days.find(({ id }) => id === dayId)

      if (!toDay) {
        throw new GraphQLError(t('errors.missingDay'))
      }

      // move entry to other day:
      if (fromDay !== toDay) {
        // update orderIds within old day
        fromDay.entries.forEach((entry) => {
          if (entry.orderId > movedEntry.orderId) {
            entry.orderId = entry.orderId - 1
          }
        })

        // update orderIds within new day
        toDay.entries.forEach((entry) => {
          if (entry.orderId >= orderId) {
            entry.orderId = entry.orderId + 1
          }
        })

        // update day entries
        toDay.entries = [...toDay.entries, movedEntry]
        fromDay.entries = fromDay.entries.filter((entry) => entry.id !== entryId)

        // update order_id of entry
        movedEntry.orderId = orderId
      }

      // move entry within day
      if (fromDay === toDay && movedEntry.orderId !== orderId) {
        // entry moved down
        if (movedEntry.orderId < orderId) {
          // update orderIds within day
          fromDay.entries.forEach((entry) => {
            if (entry.orderId > movedEntry.orderId && entry.orderId <= orderId) {
              entry.orderId = entry.orderId - 1
            }
          })
        }

        // entry moved up
        if (movedEntry.orderId > orderId) {
          // update orderIds within day
          fromDay.entries.forEach((entry) => {
            if (entry.orderId >= orderId && entry.orderId < movedEntry.orderId) {
              entry.orderId = entry.orderId + 1
            }
          })
        }

        // update orderId of entry
        movedEntry.orderId = orderId
      }

      await updateReport(report, { updateKeys: ['days'] })

      return {
        day: toDay,
        entry: movedEntry,
        report: report,
      }
    },
  },
}
