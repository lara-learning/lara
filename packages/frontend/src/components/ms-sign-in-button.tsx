import React, { ButtonHTMLAttributes } from 'react'
import AppHistory from '../app-history'
import { PrimaryButton } from './button'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../hooks/ms-auth'
import { useAuthentication } from '../hooks/use-authentication'
import { useLoginPageLoginMutation } from '../graphql'
import { useIsAuthenticated } from '@azure/msal-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
}
export const SignInButton: React.FunctionComponent<ButtonProps> = () => {
  const { instance, accounts } = useMsal()
  const { login } = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()
  const isAuthenticated = useIsAuthenticated()

   const handleLogin  = async (loginType: any) => {
    if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e)
      })
    }
    if (isAuthenticated) {
      const request = {
        ...loginRequest,
        account: accounts[0],
      }
      const authResult = await instance.acquireTokenSilent(request)
      const email = authResult.account?.username
      if (email) {
        mutate({variables: { email } }).then((response) => {
          const {data} = response
          if (!data?.login) {
            return AppHistory.getInstance().push('/no-user-found')
          }
          login(data.login)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
  return <PrimaryButton onClick={() => handleLogin('redirect')}>sign in with ACN</PrimaryButton>
}
