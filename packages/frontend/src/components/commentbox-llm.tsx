import { Comment, UserInterface } from '../graphql'
import LLMCommentBubble from './llm-comment-bubble'

interface CommentLLMBoxProps {
  comments?: (Pick<Comment, 'text' | 'id' | 'published'> & {
    user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  })[]
  llmcommentforday: string | undefined
}

//update hier Änderungen von API am Kommentar überschreibe den Prop

const CommentBoxLLM: React.FC<CommentLLMBoxProps> = ({ llmcommentforday }) => {
  if (!llmcommentforday) return null
  return (
    <>
      <LLMCommentBubble author="LLM" llmcommentforday={llmcommentforday} />
    </>
  )
}

export default CommentBoxLLM
