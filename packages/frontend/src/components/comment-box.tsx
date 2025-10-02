import React from 'react'

import { Comment, useCommentBoxDataQuery, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'
import Loader from './loader'

interface CommentBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
  updateMessage?: (message: string, commentId: string) => void
}

const CommentBox: React.FunctionComponent<CommentBoxProps> = ({ comments, updateMessage }) => {
  const { data, loading } = useCommentBoxDataQuery()

  if (loading || !data) {
    return <Loader size="xl" padding="xl" />
  }

  const { currentUser } = data

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              author={`${comment.user.firstName} ${comment.user.lastName}`}
              message={comment.text}
              id={comment.user.id}
              right={comment.user.id !== currentUser?.id}
              updateMessage={comment.user.id === currentUser?.id && !comment.published ? updateMessage : undefined}
              commentId={comment.id}
            />
          ))
        : null}
    </>
  )
}

export default CommentBox
