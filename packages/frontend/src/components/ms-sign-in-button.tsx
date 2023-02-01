import React from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../hooks/ms-auth'
import { PrimaryButton } from './button'

/**
 * Renders a button which, when selected, will redirect the page to the login prompt
 */
export const SignInButton = () => {
  const { instance } = useMsal()

  const handleLogin = (loginType: any) => {
    if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e)
      })
    }
  }
  return <PrimaryButton onClick={() => handleLogin('redirect')}>sign in with ACN</PrimaryButton>
}
