import React from 'react'

import { H1, H2, StyledIcon, StyledErrorPageWrapper, StyledErrorPageContent } from '@lara/components'

import strings from '../locales/localization'

interface ErrorPageProps {
  message?: string
}

const ErrorPage: React.FunctionComponent<ErrorPageProps> = ({ message }) => {
  return (
    <StyledErrorPageWrapper>
      <StyledErrorPageContent>
        <StyledIcon name="SinkingShip" size="4" color="blueFont" />
        <H1 styleLight center>
          {message || strings.errors.default}
        </H1>
        <H2 styleLight center>
          {strings.errors.subtext}
        </H2>
      </StyledErrorPageContent>
    </StyledErrorPageWrapper>
  )
}

export default ErrorPage
