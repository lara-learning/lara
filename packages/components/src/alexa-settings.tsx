import React, { JSX } from 'react'
import styled from 'styled-components'

import { StyledIcon } from './icons'
import { Spacings } from './spacing'

const Container = styled.div`
  display: grid;
  grid-template-columns: 20% auto;
  grid-gap: ${Spacings.xl};

  @media (max-width: 639px) {
    grid-template-columns: auto;
  }
`

const BodyContainer = styled.div`
  display: grid;
  justify-items: baseline;
  align-items: center;
  grid-auto-flow: row;
`

const StyledAlexaIcon = styled(StyledIcon)`
  @media (max-width: 639px) {
    display: none;
  }
  fill: ${(props) => props.theme.iconLightGrey};
`

interface AlexaSettingsLayoutProps {
  headline?: JSX.Element
  body: JSX.Element
}

export const AlexaSettingsLayout: React.FC<AlexaSettingsLayoutProps> = ({ headline, body }) => {
  return (
    <Container>
      <StyledAlexaIcon name="Alexa" />

      <BodyContainer>
        {headline}
        {body}
      </BodyContainer>
    </Container>
  )
}
