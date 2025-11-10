import React from 'react'

import { Comment, PaperComment, useCommentBoxDataQuery, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'
import Loader from './loader'

type TransformedCommentArray =
  | Array<
      Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      }
    >
  | Array<Pick<PaperComment, 'text' | 'published' | 'lastName' | 'firstName' | 'userId'>>

type TransformedComment =
  | (Pick<Comment, 'id' | 'text' | 'published'> & {
      user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
    })
  | Pick<PaperComment, 'text' | 'published' | 'lastName' | 'firstName' | 'userId'>

interface CommentBoxProps {
  comments?: TransformedCommentArray
  updateMessage?: (message: string, commentId: string) => void
}

const CommentBox: React.FunctionComponent<CommentBoxProps> = ({ comments, updateMessage }) => {
  const { data, loading } = useCommentBoxDataQuery()

  if (loading || !data) {
    return <Loader size="xl" padding="xl" />
  }

  const { currentUser } = data

  const getFirstName = (comment: TransformedComment) => {
    if ('user' in comment) {
      return comment.user.firstName
    } else {
      return comment.firstName
    }
  }

  const getLastName = (comment: TransformedComment) => {
    if ('user' in comment) {
      return comment.user.lastName
    } else {
      return comment.lastName
    }
  }

  const getUserId = (comment: TransformedComment) => {
    if ('user' in comment) {
      return comment.user.id
    } else {
      return comment.userId
    }
  }

  const getId = (comment: TransformedComment) => {
    if ('id' in comment) {
      return comment.id
    } else {
      return comment.userId
    }
  }

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <CommentBubble
              key={getId(comment)}
              author={`${getFirstName(comment)} ${getLastName(comment)}`}
              message={comment.text}
              id={getUserId(comment)}
              right={getUserId(comment) !== currentUser?.id}
              updateMessage={getUserId(comment) === currentUser?.id && !comment.published ? updateMessage : undefined}
              commentId={getId(comment)}
            />
          ))
        : null}
    </>
  )
}

export default CommentBox
