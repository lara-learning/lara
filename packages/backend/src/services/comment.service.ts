import { GraphQLError } from 'graphql'
import { v4 } from 'uuid'

import { Comment, CommentableInterface, GqlResolversTypes, Report, User } from '@lara/api'

import { updateReport } from '../repositories/report.repo'
import { traineeById } from '../repositories/trainee.repo'
import { reportsWithinApprenticeship } from './report.service'
import { createT, t } from '../i18n'

/**
 * Generates a new Comment
 * @param text Comment text
 * @param user Commenting user
 * @returns New comment
 */
export const generateComment = (text: string, user: User): Comment => {
  return {
    id: v4(),
    createdAt: new Date().toISOString(),
    userId: user.id,
    text,
    published: false,
  }
}

type CreateCommentOnCommentableOptions = {
  commentable?: CommentableInterface
  report?: Report
  text: string
  currentUser: User
}

/**
 * Abstract method to create comments for entries, days and reports
 * @param options Data for creating a comment
 * @returns GQL create comment payload
 */
export const createCommentOnCommentable = async ({
  commentable,
  text,
  report,
  currentUser,
}: CreateCommentOnCommentableOptions): Promise<GqlResolversTypes['CreateCommentPayload']> => {
  const t = createT(currentUser.language)

  if (!report) {
    throw new GraphQLError(t('errors.missingReport'))
  }

  if (!commentable) {
    throw new GraphQLError(t('errors.missingCommentable'))
  }

  const comment = generateComment(text, currentUser)
  commentable.comments = [...commentable.comments, comment]

  await updateReport(report, { updateKeys: ['days', 'comments'] })

  return {
    comment,
    commentable,
  }
}

type UpdateCommentOnCommentableOptions = {
  commentable?: CommentableInterface
  report?: Report
  text: string
  currentUser: User
  commentId: string
}

/**
 * Abstract method to update comments for entries, days and reports
 * @param options Data for updating a comment
 * @returns GQL update comment payload
 */
export const updateCommentOnCommentable = async ({
  commentable,
  text,
  report,
  currentUser,
  commentId,
}: UpdateCommentOnCommentableOptions): Promise<GqlResolversTypes['UpdateCommentPayload']> => {
  const t = createT(currentUser.language)

  if (!report) {
    throw new GraphQLError(t('errors.missingReport'))
  }

  if (!commentable) {
    throw new GraphQLError(t('errors.missingCommentable'))
  }

  const comment = commentable.comments.find((com) => com.id === commentId)
  if (!comment) {
    throw new GraphQLError(t('errors.missingComment'))
  }
  if (comment.published) {
    throw new GraphQLError(t('errors.cantEditPublishedComment'))
  }
  comment.text = text

  await updateReport(report, { updateKeys: ['days', 'comments'] })

  return {
    comment,
    commentable,
  }
}

type DeleteCommentOnCommentableOptions = {
  commentable?: CommentableInterface
  report?: Report
  currentUser: User
  commentId: string
}

/**
 * Abstract method to delete comments for entries, days and reports
 * @param options Data for deleting a comment
 * @returns GQL delete comment payload
 */
export const deleteCommentOnCommentable = async ({
  commentable,
  report,
  currentUser,
  commentId,
}: DeleteCommentOnCommentableOptions): Promise<GqlResolversTypes['DeleteCommentPayload']> => {
  const t = createT(currentUser.language)

  if (!report) {
    throw new GraphQLError(t('errors.missingReport'))
  }

  if (!commentable) {
    throw new GraphQLError(t('errors.missingCommentable'))
  }

  const comment = commentable.comments.find((com) => com.id === commentId)
  if (!comment) {
    throw new GraphQLError(t('errors.missingComment'))
  }
  if (comment.published) {
    throw new GraphQLError(t('errors.cantEditPublishedComment'))
  }
  commentable.comments = commentable.comments.filter((com) => com.id !== comment.id)

  await updateReport(report, { updateKeys: ['days', 'comments'] })

  return {
    comment,
    commentable,
  }
}

type PublishCommenstOnReportOptions = {
  report?: Report
  currentUser: User
}

/**
 * Abstract method to publish all comments on a report
 * @param options Data for publishing comments
 * @returns GQL publish comments payload
 */
export const publishCommentsOnReport = async ({
  report,
  currentUser,
}: PublishCommenstOnReportOptions): Promise<GqlResolversTypes['PublishCommentsPayload']> => {
  const t = createT(currentUser.language)

  if (!report) {
    throw new GraphQLError(t('errors.missingReport'))
  }

  report.comments.forEach((com) => (com.published = true))
  report.days.forEach((day) => {
    day.comments.forEach((com) => (com.published = true))
    day.entries.forEach((entry) => {
      entry.comments.forEach((com) => (com.published = true))
    })
  })

  await updateReport(report, { updateKeys: ['days', 'comments'] })

  return {
    report,
  }
}

export const commentableReports = async (traineeId: string): Promise<Report[]> => {
  const trainee = await traineeById(traineeId)

  if (!trainee) {
    throw new GraphQLError(t('errors.missingUser'))
  }

  return reportsWithinApprenticeship(trainee, ['review', 'reopened'])
}
