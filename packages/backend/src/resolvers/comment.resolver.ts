import { GraphQLError } from 'graphql'

import { AuthenticatedContext, GqlResolvers } from '@lara/api'

import { reportById } from '../repositories/report.repo'
import { userById } from '../repositories/user.repo'
import { commentableReports, createCommentOnCommentable } from '../services/comment.service'
import { reportDayByDayId } from '../services/day.service'
import { reportDayEntryByEntryId } from '../services/entry.service'
import { t } from '../i18n'

export const commentResolver: GqlResolvers<AuthenticatedContext> = {
  CommentableInterface: {
    __resolveType: (model) => {
      if ('days' in model) {
        return 'Report'
      }

      if ('entries' in model) {
        return 'Day'
      }

      return 'Entry'
    },
  },
  Comment: {
    user: async (model, _args, { currentUser }) => {
      const user = await userById(model.userId)

      if (!user) {
        throw new GraphQLError(t('errors.missingUser', currentUser.language))
      }

      return user
    },
  },
  Mutation: {
    createCommentOnDay: async (_parent, { id, text, traineeId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, day } = reportDayByDayId(id, reports)

      return createCommentOnCommentable({
        commentable: day,
        text,
        currentUser,
        report,
      })
    },
    createCommentOnEntry: async (_parent, { id, text, traineeId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, entry } = reportDayEntryByEntryId(id, reports)

      return createCommentOnCommentable({
        commentable: entry,
        text,
        currentUser,
        report,
      })
    },
    createCommentOnReport: async (_parent, { id, text, traineeId }, { currentUser }) => {
      const report = await reportById(id)

      if (report?.traineeId !== traineeId) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      return createCommentOnCommentable({
        commentable: report,
        text,
        currentUser,
        report,
      })
    },
  },
}
