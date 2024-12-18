import React, { ButtonHTMLAttributes, useState } from 'react'
import AppHistory from '../app-history'
import { PrimaryButton } from './button'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../hooks/ms-auth'
import { useAuthentication } from '../hooks/use-authentication'
import { useLoginPageLoginMutation } from '../graphql'
import { useIsAuthenticated } from '@azure/msal-react'
import { EventMessage, EventType, PopupEvent } from '@azure/msal-browser'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
}

export const SignInButton: React.FunctionComponent<ButtonProps> = () => {
  const { instance } = useMsal()
  const { login } = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()
  const isAuthenticated = useIsAuthenticated()

  const [popupWindow, setPopupWindow] = useState<Window | null>(null)

  const handleLogin = async () => {
    if (isAuthenticated) {
      AppHistory.getInstance().push('/')
    }

    if (popupWindow) {
      popupWindow.focus()
      return
    }

    instance.addEventCallback((message: EventMessage) => {
      if (message.eventType === EventType.POPUP_OPENED) {
        setPopupWindow((message.payload as PopupEvent).popupWindow)
      }
    })

    try {
      const loginResponse = await instance.loginPopup(loginRequest)
      const email = loginResponse.account?.username
      if (email) {
        mutate({ variables: { email } })
          .then((response) => {
            const { data } = response
            if (!data?.login) {
              return AppHistory.getInstance().push('/no-user-found')
            }
            login(data.login)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPopupWindow(null)
    }
  }
  return <PrimaryButton onClick={() => handleLogin()}>Sign in with Microsoft</PrimaryButton>
}
