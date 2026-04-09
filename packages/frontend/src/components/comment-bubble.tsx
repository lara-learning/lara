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

const CommentBubble: React.FC<CommentBubbleProps> = ({ right, updateMessage, commentId }) => {
  const [llmResponse, setLlmResponse] = useState<LlmResponse | null>(llmStore.getResponse())

  console.log(llmResponse, 'llmResponse in comment bubble')
  useEffect(() => {
    const unsubscribe = llmStore.subscribe((res) => {
      console.log('subscription fired:', res)
      setLlmResponse(res)
    })
    return () => unsubscribe()
  }, [])
  console.log('passing to layout:', llmResponse?.result ?? '')
  return (
    <CommentBubbleLayout
      //avatar={<>{id && <Avatar size={35} id={id} />}</>}
      // author={author}
      message={llmResponse?.result ?? ''}
      right={right}
      updateMessage={updateMessage}
      commentId={commentId}
    ></CommentBubbleLayout>
  )
}

export default CommentBubble
