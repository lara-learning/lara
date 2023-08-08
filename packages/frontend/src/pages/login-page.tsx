import React from 'react'
import { Container, Paragraph, Spacer, StyledLogo } from '@lara/components'

import { Template } from '../templates/template'
import { SignInButton } from '../components/ms-sign-in-button'

const LoginPage: React.FunctionComponent = () => {
  return (
    <Template type={'Secondary'}>
      <Spacer bottom="xxl">
        <StyledLogo width="250" />
      </Spacer>
      <Container flat paddingY="xl" paddingX="xxl">
        <Spacer bottom="l">
          <Paragraph noMargin center>
            Authenticate using your company email
          </Paragraph>
        </Spacer>
        <Paragraph center noMargin>
          <SignInButton />
        </Paragraph>
      </Container>
    </Template>
  )
}

export default LoginPage
