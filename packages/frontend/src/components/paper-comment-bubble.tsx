import React from 'react'

import { CommentBubbleLayout } from '@lara/components'

interface CommentBubbleProps {
  message?: string
}

const CommentBubble: React.FunctionComponent<CommentBubbleProps> = ({ message }) => {
  return (
    <CommentBubbleLayout
      message={message}
    ></CommentBubbleLayout>
  )
}

export default CommentBubble
