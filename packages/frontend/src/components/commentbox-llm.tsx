import React, { useEffect, useState } from 'react'
import { Comment, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'
import { LlmResponse, llmStore } from '../helper/llm-store'

interface CommentLLMBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
}

const CommentBoxLLM: React.FC<CommentLLMBoxProps> = ({ comments }) => {
  const [llmResponse, setLlmResponse] = useState<LlmResponse | null>(llmStore.getResponse())

  useEffect(() => {
    const unsubscribe = llmStore.subscribe(setLlmResponse)
    return () => unsubscribe()
  }, [])

  return (
    <>
      {comments?.map((comment) => (
        <CommentBubble
          key={comment.id}
          author="LLM"
          message={llmResponse ? llmResponse.text : ''}
          id={comment.user.id}
          commentId={comment.id}
        />
      ))}
    </>
  )
}

export default CommentBoxLLM
