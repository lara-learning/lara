import React, { JSX, ReactNode } from 'react'
import styled from 'styled-components'
import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'

import { Spacings } from './spacing'

export const StyledFaqTitle = styled.h1`
  font-size: 200px;
  color: ${(props) => props.theme.faq};
  margin: 0;
  z-index: 0;
`

const StyledFAQLayout = styled.div`
  display: grid;
  justify-items: center;
  grid-gap: ${Spacings.xxl};
`

const StyledFAQHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`

type FaqLayoutProps = {
  title: JSX.Element
  search: JSX.Element
  children: ReactNode
}

export const FaqLayout: React.FC<FaqLayoutProps> = ({ title, search, children }) => {
  return (
    <StyledFAQLayout>
      <StyledFAQHeader>
        {title}
        {search}
      </StyledFAQHeader>
      {children}
    </StyledFAQLayout>
  )
}

export const StyledFAQSearch = styled.input`
  margin-left: ${Spacings.s};
  cursor: text;
  outline: none;
  font-size: ${FontSizes.copy};
  border: none;
  background-color: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.lightFont};

  ::placeholder {
    color: ${(props) => props.theme.lightFont};
  }
`
export const StyledFAQSearchWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  background-color: ${(props) => props.theme.surface};
  align-items: center;
  border-radius: ${BorderRadii.xxs} ${BorderRadii.xxs} 0px 0px;
  border-bottom: 2px solid ${(props) => props.theme.inputBorderEmpty};
  box-shadow: 0px 7px 14px 0px #1e27311a;
  padding: ${Spacings.xxs};
  position: absolute;
  top: 60%;
  min-width: 80%;

  &:focus-within {
    border-bottom: 2px solid ${(props) => props.theme.inputBorderActive};
  }
`
