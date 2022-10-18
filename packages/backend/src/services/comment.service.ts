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

export const commentableReports = async (traineeId: string): Promise<Report[]> => {
  const trainee = await traineeById(traineeId)

  if (!trainee) {
    throw new GraphQLError(t('errors.missingUser'))
  }

  return reportsWithinApprenticeship(trainee, ['review', 'reopened'])
}
