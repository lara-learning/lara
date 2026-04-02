import React, { useState, useEffect } from 'react'
import { Comment, useCommentBoxDataQuery, UserInterface } from '../graphql'
import CommentBubble from './comment-bubble'
import Loader from './loader.js'

const inputText = 'Viel in Meetings nichts gemacht'

interface CommentBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
  updateMessage?: (message: string, commentId: string) => void
}

const CommentBox: React.FunctionComponent<CommentBoxProps> = ({ comments, updateMessage }) => {
  const [response, setResponse] = useState<string>('')

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await fetch('/ai_assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText }), // send input to backend
        })

        if (!res.ok) throw new Error(`Server error: ${res.status}`)

        const data = await res.json()
        setResponse(data.result)
      } catch (err) {
        console.error(err)
        setResponse('Failed to get AI response')
      }
    }

    fetchAI()
  }, [inputText])

  const { data, loading } = useCommentBoxDataQuery()

  if (loading || !data) {
    return <Loader size="xl" padding="xl" />
  }

  const { currentUser } = data

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              author="LLM"
              message={response}
              id={comment.user.id}
              right={comment.user.id !== currentUser?.id}
              updateMessage={comment.user.id === currentUser?.id && !comment.published ? updateMessage : undefined}
              commentId={comment.id}
            />
          ))
        : null}
    </>
  )
}

export default CommentBox
