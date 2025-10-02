import { GraphQLError } from 'graphql'

import { AuthenticatedContext, GqlResolvers } from '@lara/api'

import { reportById } from '../repositories/report.repo'
import { userById } from '../repositories/user.repo'
import {
  commentableReports,
  createCommentOnCommentable,
  deleteCommentOnCommentable,
  publishCommentsOnReport,
  updateCommentOnCommentable,
} from '../services/comment.service'
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
    updateCommentOnDay: async (_parent, { id, text, traineeId, commentId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, day } = reportDayByDayId(id, reports)

      return updateCommentOnCommentable({
        commentable: day,
        text,
        currentUser,
        report,
        commentId,
      })
    },
    updateCommentOnEntry: async (_parent, { id, text, traineeId, commentId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, entry } = reportDayEntryByEntryId(id, reports)

      return updateCommentOnCommentable({
        commentable: entry,
        text,
        currentUser,
        report,
        commentId,
      })
    },
    updateCommentOnReport: async (_parent, { id, text, traineeId, commentId }, { currentUser }) => {
      const report = await reportById(id)

      if (report?.traineeId !== traineeId) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      return updateCommentOnCommentable({
        commentable: report,
        text,
        currentUser,
        report,
        commentId,
      })
    },
    deleteCommentOnDay: async (_parent, { id, traineeId, commentId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, day } = reportDayByDayId(id, reports)

      return deleteCommentOnCommentable({
        commentable: day,
        currentUser,
        report,
        commentId,
      })
    },
    deleteCommentOnEntry: async (_parent, { id, traineeId, commentId }, { currentUser }) => {
      const reports = await commentableReports(traineeId)
      const { report, entry } = reportDayEntryByEntryId(id, reports)

      return deleteCommentOnCommentable({
        commentable: entry,
        currentUser,
        report,
        commentId,
      })
    },
    deleteCommentOnReport: async (_parent, { id, traineeId, commentId }, { currentUser }) => {
      const report = await reportById(id)

      if (report?.traineeId !== traineeId) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      return deleteCommentOnCommentable({
        commentable: report,
        currentUser,
        report,
        commentId,
      })
    },
    publishAllComments: async (_parent, { id, traineeId }, { currentUser }) => {
      const report = await reportById(id)

      if (report?.traineeId !== traineeId) {
        throw new GraphQLError(t('errors.missingReport', currentUser.language))
      }

      return publishCommentsOnReport({
        currentUser,
        report,
      })
    },
  },
}
