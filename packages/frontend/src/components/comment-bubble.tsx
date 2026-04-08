import React, { useEffect, useState } from 'react'

import { CommentBubbleLayout } from '@lara/components'
import { LlmResponse, llmStore } from '../helper/llm-store'

interface CommentBubbleProps {
  id?: string
  author?: string
  message?: string
  right?: boolean
  updateMessage?: (message: string, commentId: string) => void
  commentId?: string
}

const CommentBubble: React.FC<CommentBubbleProps> = ({ message, right, updateMessage, commentId }) => {
  const [llmResponse, setLlmResponse] = useState<LlmResponse | null>(llmStore.getResponse())

  console.log(llmResponse, 'llmResponse')
  useEffect(() => {
    const unsubscribe = llmStore.subscribe(setLlmResponse)
    return () => unsubscribe()
  }, [])

  return (
    <CommentBubbleLayout
      // avatar={<>{id && <Avatar size={35} id={id} />}</>}
      // author={author}
      message={message}
      right={right}
      updateMessage={updateMessage}
      commentId={commentId}
    >
      {/* Render LLM response text inside the children area */}
      {llmResponse?.text ?? ''}
    </CommentBubbleLayout>
  )
}

export default CommentBubble
