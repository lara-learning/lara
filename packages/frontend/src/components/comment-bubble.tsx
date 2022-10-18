import React from 'react'

import { CommentBubbleLayout } from '@lara/components'

import Avatar from './avatar'

interface CommentBubbleProps {
  avatar?: string
  author?: string
  message?: string
  right?: boolean
}

const CommentBubble: React.FunctionComponent<CommentBubbleProps> = ({ avatar, author, message, right }) => {
  return (
    <CommentBubbleLayout
      avatar={<>{avatar && <Avatar size={35} image={avatar} />}</>}
      author={author}
      message={message}
      right={right}
    ></CommentBubbleLayout>
  )
}

export default CommentBubble
