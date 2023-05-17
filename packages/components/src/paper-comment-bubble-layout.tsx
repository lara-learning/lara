import React from 'react'
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
  }
`

interface PaperCommentBubbleLayoutProps {
  message?: string
}

export const PaperCommentBubbleLayout: React.FC<PaperCommentBubbleLayoutProps> = ({ message }) => {
  return (
    <MessageContainer>
      <Bubble>{message}</Bubble>
    </MessageContainer>
  )
}
