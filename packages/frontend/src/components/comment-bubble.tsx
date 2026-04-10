import React from 'react'

import { CommentBubbleLayout } from '@lara/components'

import Avatar from './avatar'

interface CommentBubbleProps {
  id?: string
  author?: string
  message?: string
  right?: boolean
  updateMessage?: (message: string, commentId: string) => void
  commentId?: string
}

const CommentBubble: React.FunctionComponent<CommentBubbleProps> = ({
  id,
  author,
  message,
  right,
  updateMessage,
  commentId,
}) => {
  return (
    <CommentBubbleLayout
      avatar={<>{id && <Avatar size={35} id={id} />}</>}
      author={author}
      message={message}
      right={right}
      updateMessage={updateMessage}
      commentId={commentId}
    ></CommentBubbleLayout>
  )
}

export default CommentBubble
