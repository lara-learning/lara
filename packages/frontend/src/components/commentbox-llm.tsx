import React, { useState } from 'react'
import { Comment, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'

interface CommentBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
  updateMessage?: (message: string, commentId: string) => void
}

const CommentBoxLLM: React.FunctionComponent<CommentBoxProps> = ({ comments }) => {
  const [response] = useState<string>('')

  // useEffect(() => {
  //   const fetchAI = async () => {
  //     try {
  //       const res = await fetch('/ai_assistant', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ inputText }), // send input to backend
  //       })

  //       if (!res.ok) throw new Error(`Server error: ${res.status}`)

  //       const data = await res.json()
  //       setResponse(data.result)
  //     } catch (err) {
  //       console.error(err)
  //       setResponse('Failed to get AI response')
  //     }
  //   }

  //   fetchAI()
  // }, [inputText])

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              author="LLM"
              message={response}
              id={comment.user.id}
              commentId={comment.id}
            />
          ))
        : null}
    </>
  )
}

export default CommentBoxLLM
