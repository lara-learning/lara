import React from 'react'

import { PaperCommentBubbleLayout } from '@lara/components'

interface CommentBubbleProps {
  message?: string
}

const CommentBubble: React.FunctionComponent<CommentBubbleProps> = ({ message }) => {
  return <PaperCommentBubbleLayout message={message}></PaperCommentBubbleLayout>
}

export default CommentBubble
