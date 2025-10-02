import React, { JSX, useState } from 'react'
import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

const MessageContainer = styled.div<{ right?: boolean }>`
  position: relative;
  display: flex;
  padding: ${Spacings.m} ${Spacings.l};
  flex-direction: ${(props) => (props.right ? 'row-reverse' : 'row')};
`

const Bubble = styled.div<{ right?: boolean }>`
  flex: 1;
  padding: ${Spacings.m};
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.mediumFont};
  line-height: 1.4;
  background-color: ${(props) => props.theme.background};
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

const MessageInput = styled.input`
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

interface CommentBubbleLayoutProps {
  avatar?: JSX.Element
  author?: string
  message?: string
  right?: boolean
  updateMessage?: (message: string, commentId: string) => void
  commentId?: string
}

export const CommentBubbleLayout: React.FC<CommentBubbleLayoutProps> = ({
  avatar,
  author,
  message,
  right,
  updateMessage,
  commentId,
}) => {
  const [msg, setMsg] = useState(message)

  const updateComment = (newMsg: string) => {
    if (updateMessage) updateMessage(newMsg, commentId ?? '')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const key = event.key

    if (key === 'Enter') {
      target.blur()
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    if (target.value === message && target.value !== '') return
    console.log(commentId + ' UPDATE: ' + message + ' => ' + target.value)
    updateComment(target.value)
  }

  return (
    <MessageContainer right={right}>
      <Bubble right={right}>
        <Author>{author}:</Author>
        {updateMessage ? (
          <MessageInput
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        ) : (
          message
        )}
      </Bubble>
      {avatar}
    </MessageContainer>
  )
}
