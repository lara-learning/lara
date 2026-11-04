import React, { ButtonHTMLAttributes, useState } from 'react'
import { PrimaryButton } from './button'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../hooks/ms-auth'
import { useAuthentication } from '../hooks/use-authentication'
import { useIsAuthenticated } from '@azure/msal-react'
import { EventMessage, EventType, PopupEvent } from '@azure/msal-browser'
import { useNavigate } from 'react-router'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { isOAuthData } from '../helper/auth-helper'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
}

export const SignInButton: React.FunctionComponent<ButtonProps> = () => {
  const { instance } = useMsal()
  const { login } = useAuthentication()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const { addToast } = useToastContext()

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
      if (!loginResponse.idToken) {
        throw new Error('Microsoft did not return an ID token')
      }

      const response = await fetch(`${ENVIRONMENT.backendUrl}/backend/oauth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: loginResponse.idToken }),
      })

      if (response.status === 404) {
        navigate('/no-user-found')
        return
      }

      if (!response.ok) {
        throw new Error(`Microsoft sign-in failed with status ${response.status}`)
      }

      const oauthData: unknown = await response.json()
      if (!isOAuthData(oauthData)) {
        throw new Error('Microsoft sign-in returned an invalid response')
      }

      login(oauthData)
    } catch (error) {
      console.error(error)
      addToast({
        icon: 'Error',
        title: strings.login.userNotRegisteredError.title,
        text: strings.login.userNotRegisteredError.description,
        type: 'error',
      })
    } finally {
      setPopupWindow(null)
    }
  }
  return <PrimaryButton onClick={() => handleLogin()}>Sign in with Microsoft</PrimaryButton>
}
