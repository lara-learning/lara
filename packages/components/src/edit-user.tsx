import React, { JSX, ReactNode } from 'react'
import styled from 'styled-components'

import { Container } from './container'
import { Spacings } from './spacing'
import { UnstyledLink } from './unstyled-link'

type EditUserLayoutProps = {
  backButton: JSX.Element
  content?: ReactNode
  actions: JSX.Element
}

const StyledHeader = styled.div`
  display: flex;
  margin-bottom: ${Spacings.l};
`

const StyledActions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: ${Spacings.xl};
`

export const EditUserLayout: React.FC<EditUserLayoutProps> = ({ backButton, content, actions }) => {
  return (
    <div>
      <StyledHeader>{backButton}</StyledHeader>
      <Container padding="l">{content}</Container>
      <StyledActions>{actions}</StyledActions>
    </div>
  )
}

const StyledRowGrid = styled(Container)`
  display: grid;
  grid-template-columns: 1fr auto;
`

type EditUserRowLayoutProps = {
  content: JSX.Element
  button: JSX.Element
  to: string
}

export const EditUserRowLayout: React.FC<EditUserRowLayoutProps> = ({ content, button, to }) => {
  return (
    <UnstyledLink to={to} fullWidth>
      <StyledRowGrid padding="m">
        {content}
        {button}
      </StyledRowGrid>
    </UnstyledLink>
  )
}
