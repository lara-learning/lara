import React from 'react'

import { Comment, useCommentBoxDataQuery, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'
import Loader from './loader'

interface CommentBoxProps {
  comments?: (Pick<Comment, 'text'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName' | 'avatar'>
  })[]
}

const CommentBox: React.FunctionComponent<CommentBoxProps> = ({ comments }) => {
  const { data, loading } = useCommentBoxDataQuery()

  if (loading || !data) {
    return <Loader size="xl" padding="xl" />
  }

  const { currentUser } = data

  return (
    <>
      {comments
        ? comments.map((comment, index) => (
            <CommentBubble
              key={index}
              author={`${comment.user.firstName} ${comment.user.lastName}`}
              message={comment.text}
              avatar={comment.user.avatar}
              right={comment.user.id !== currentUser?.id}
            />
          ))
        : null}
    </>
  )
}

export default CommentBox
