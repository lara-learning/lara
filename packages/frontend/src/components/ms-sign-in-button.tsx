import React, { ButtonHTMLAttributes, useState } from 'react'
import { PrimaryButton } from './button'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../hooks/ms-auth'
import { useAuthentication } from '../hooks/use-authentication'
import { useLoginPageLoginMutation } from '../graphql'
import { useIsAuthenticated } from '@azure/msal-react'
import { EventMessage, EventType, PopupEvent } from '@azure/msal-browser'
import { useNavigate } from 'react-router'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
}

export const SignInButton: React.FunctionComponent<ButtonProps> = () => {
  const { instance } = useMsal()
  const { login } = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  const [popupWindow, setPopupWindow] = useState<Window | null>(null)

  const handleLogin = async () => {
    if (isAuthenticated) {
      navigate('/')
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

      let avatar: string | undefined
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account: loginResponse.account,
        })

        const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        })

        if (photoResponse.ok) {
          const blob = await photoResponse.blob()
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            avatar = reader.result as string
          }
        }
      } catch (error) {
        console.warn('Fetching Microsoft account image failed:', error)
      }

      const email = loginResponse.account?.username
      if (email) {
        mutate({ variables: { email } })
          .then((response) => {
            const { data } = response
            if (!data?.login) {
              navigate('/no-user-found')
              return
            }
            login(data.login, avatar)
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
