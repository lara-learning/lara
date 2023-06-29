import React, {useState} from 'react'
import {TokenResponse, useGoogleLogin} from '@react-oauth/google'

import {Container, Paragraph, Spacer, StyledLogo} from '@lara/components'

import AppHistory from '../app-history'
import {useLoginPageLoginMutation} from '../graphql'
import {useAuthentication} from '../hooks/use-authentication'
import {Template} from '../templates/template'
import {SplashPage} from './splash-page'
import {PrimaryButton} from '../components/button'

const LoginPage: React.FunctionComponent = () => {
  const {login} = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()

  const [authLoading, setAuthLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => onLoginSuccess(tokenResponse),
    onError: () => onLoginFailure,
  })

  const onLoginSuccess = (tokenResponse: TokenResponse) => {
    setAuthLoading(true)

    if (!tokenResponse) {
      return
    }

    const accessToken = tokenResponse.access_token

    mutate({variables: {token: accessToken}}).then((response) => {
      const {data} = response

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
    return <SplashPage/>
  }

  return (
    <Template type={'Secondary'}>
      <Spacer bottom="xxl">
        <StyledLogo width="250"/>
      </Spacer>
      <Container flat paddingY="xl" paddingX="xxl">
        <Spacer bottom="xl">
          <Paragraph noMargin center>
            Authenticate using your company email
          </Paragraph>
        </Spacer>
        {ENVIRONMENT.useGoogleLogin ?
          <>
          {console.log(ENVIRONMENT.useGoogleLogin)}
            </>
          :
          <Paragraph center noMargin>
            <PrimaryButton onClick={() => googleLogin()}>sign in with
              Google
            </PrimaryButton>
          </Paragraph>
        }
      </Container>
    </Template>
  )
}

export default LoginPage
