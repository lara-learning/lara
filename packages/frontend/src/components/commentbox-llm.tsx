import React, { useEffect, useState } from 'react'
import { Comment, UserInterface } from '../graphql'
import { LlmResponse, llmStore } from '../helper/llm-store'
import LLMCommentBubble from './llm-comment-bubble'

interface CommentLLMBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
}

const CommentBoxLLM: React.FC<CommentLLMBoxProps> = () => {
  const [llmResponse, setLlmResponse] = useState<LlmResponse | null>(llmStore.getResponse())

  useEffect(() => {
    const unsubscribe = llmStore.subscribe(setLlmResponse)
    console.log(llmResponse, 'commentbox-llm llmResponse')
    return () => unsubscribe()
  }, [llmResponse])

  return (
    <>
      <LLMCommentBubble author="LLM" message={llmResponse ? llmResponse.result : ''} />
    </>
  )
}

export default CommentBoxLLM
