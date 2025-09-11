import React, { JSX, ReactNode } from 'react'
import styled from 'styled-components'

import { BorderRadii } from './border-radius'

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
const StyledLoadingIconWrapper = styled.div`
  position: absolute;
  height: 50%;
  width: 50%;
`

interface AvatarLayoutProps {
  size: number
  children: ReactNode
  loadingIcon: JSX.Element
  noImageIcon: JSX.Element
}

export const AvatarLayout: React.FC<AvatarLayoutProps> = ({ size, children, loadingIcon, noImageIcon }) => {
  return (
    <AvatarContainer size={size}>
      {loadingIcon && <StyledLoadingIconWrapper>{loadingIcon}</StyledLoadingIconWrapper>}
      {children && <StyledImageWrapper>{children}</StyledImageWrapper>}
      {noImageIcon}
    </AvatarContainer>
  )
}
