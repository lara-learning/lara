import React from 'react'

import { CommentBubbleLayout } from '@lara/components'

import Avatar from './avatar'

interface CommentBubbleProps {
  id?: string
  author?: string
  message?: string
  right?: boolean
}

const CommentBubble: React.FunctionComponent<CommentBubbleProps> = ({ id, author, message, right }) => {
  return (
    <CommentBubbleLayout
      avatar={<>{id && <Avatar size={35} id={id} />}</>}
      author={author}
      message={message}
      right={right}
    ></CommentBubbleLayout>
  )
}

export default CommentBubble
