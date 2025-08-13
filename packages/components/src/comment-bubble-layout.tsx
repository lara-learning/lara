import React, { JSX } from 'react'
import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

const MessageContainer = styled.div<{ right?: boolean }>`
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

interface CommentBubbleLayoutProps {
  avatar?: JSX.Element
  author?: string
  message?: string
  right?: boolean
}

export const CommentBubbleLayout: React.FC<CommentBubbleLayoutProps> = ({ avatar, author, message, right }) => {
  return (
    <MessageContainer right={right}>
      <Bubble right={right}>
        <Author>{author}:</Author>
        {message}
      </Bubble>
      {avatar}
    </MessageContainer>
  )
}
