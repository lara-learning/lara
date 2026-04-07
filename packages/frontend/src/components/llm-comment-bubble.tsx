import { BorderRadii, Spacings } from '@lara/components'
import styled from 'styled-components'
import llmIcon from '../assets/llm-icon.png'

// then use it as:
;<img src={llmIcon} />

interface CommentBubbleProps {
  id?: string
  author?: string
  message?: string
  right?: boolean
  updateMessage?: (message: string, commentId: string) => void
  commentId?: string
  llmcommentforday: string
}

const MessageInput = styled.textarea`
  all: unset;
  width: 100%;
  height: 28px;
  border-bottom: 1px solid ${(props) => props.theme.inputBorderEmpty};
  border-radius: 2px;
  transition: border-bottom 0.2s;

  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.inputBorderSaved};
  }
`

const MessageContainer = styled.div<{ right?: boolean }>`
  position: relative;
  display: flex;
  padding: ${Spacings.m} ${Spacings.l};
  flex-direction: ${(props) => (props.right ? 'row-reverse' : 'row')};
`

const Bubble = styled.div<{ right?: boolean }>`
  flex: 1;
  padding: ${Spacings.m};
  color: ${(props) => props.theme.mediumFont};

  line-height: 1.4;
  background-color: #c3caff;
  border-radius: ${BorderRadii.xxs};
  margin-left: ${(props) => props.right && Spacings.m};
  margin-right: ${(props) => !props.right && Spacings.m};
  position: relative;
  word-break: break-word;
  :after {
    right: ${(props) => props.right && '100%'};
    left: ${(props) => !props.right && '100%'};
    top: 17.5px;
    border: solid transparent;
    content: '';
    position: absolute;
    border-right-color: ${(props) => props.right && props.theme.background};
    border-left-color: ${(props) => !props.right && props.theme.background};
    border-width: 10px;
    margin-top: -10px;
  }
`

const Author = styled.span`
  font-weight: bold;
  display: block;
`

const AvatarContainer = styled.div<{ size: number }>`
  position: relative;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  background: ${(props) => props.theme.background};
  border-radius: ${BorderRadii.round};
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const StyledImageWrapper = styled.div`
  height: 100%;
  width: 100%;
`

const LLMCommentBubble: React.FC<CommentBubbleProps> = ({ right, llmcommentforday }) => {
  return (
    <MessageContainer right={right}>
      <Bubble right={right}>
        <Author>LLM:</Author>
        <MessageInput value={llmcommentforday} />
      </Bubble>

      <AvatarContainer size={35}>
        <StyledImageWrapper>
          <img src={llmIcon} />
        </StyledImageWrapper>
      </AvatarContainer>
    </MessageContainer>
  )
}

export default LLMCommentBubble
