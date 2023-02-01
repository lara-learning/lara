import React, { useState } from 'react'
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'

import { Container, Paragraph, Spacer, StyledLogo } from '@lara/components'

import AppHistory from '../app-history'
import { PrimaryButton } from '../components/button'
import { useLoginPageLoginMutation } from '../graphql'
import { useAuthentication } from '../hooks/use-authentication'
import { Template } from '../templates/template'
import { SplashPage } from './splash-page'
import { SignInButton } from '../components/ms-sign-in-button'

const LoginPage: React.FunctionComponent = () => {
  const { login } = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()

  const [authLoading, setAuthLoading] = useState(false)

  const onLoginSuccess = (googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setAuthLoading(true)

    if (!('getAuthResponse' in googleResponse)) {
      return
    }

    const accessToken = googleResponse.getAuthResponse().access_token

    mutate({ variables: { token: accessToken } }).then((response) => {
      const { data } = response

      if (!data?.login) {
        return AppHistory.getInstance().push('/no-user-found')
      }

      login(data.login)
    })
  }

  const onLoginFailure = (error: string) => {
    console.log('Login error', error)
    return
  }

  if (authLoading) {
    return <SplashPage />
  }

  return (
    <Template type={'Secondary'}>
      <Spacer bottom="xxl">
        <StyledLogo width="250" />
      </Spacer>
      <Container flat paddingY="xl" paddingX="xxl">
        <Spacer bottom="xl">
          <Paragraph noMargin center>
            Authenticate using your company email
          </Paragraph>
        </Spacer>
        <Paragraph center noMargin>
          <Spacer bottom="xs">
            <GoogleLogin
              render={({ onClick, disabled }) => (
                <PrimaryButton onClick={onClick} disabled={disabled}>
                  sign in with Google
                </PrimaryButton>
              )}
              clientId={ENVIRONMENT.googleClientID}
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
            />
          </Spacer>
          <SignInButton />
        </Paragraph>
      </Container>
    </Template>
  )
}

export default LoginPage
