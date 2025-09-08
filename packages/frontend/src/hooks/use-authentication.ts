import React, { useContext } from 'react'

import { OAuthPayload } from '../graphql'
import { clearOAuthData, saveAvatar, saveOAuthData } from '../helper/auth-helper'

export type AuthenticatedState = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthenticationContext {
  readonly authenticated: AuthenticatedState
  setAuthenticated: (authenticated: AuthenticatedState) => void
}

export const AuthenticationContext = React.createContext<AuthenticationContext>({
  authenticated: 'loading',
  setAuthenticated: () => undefined,
})

type AuthenticationFCs = AuthenticationContext & {
  login: (payload?: OAuthPayload, avatar?: string) => void
  logout: () => void
}

export const useAuthentication = (): AuthenticationFCs => {
  const { setAuthenticated, authenticated } = useContext(AuthenticationContext)

  return {
    login: (payload, avatar) => {
      if (payload) {
        saveOAuthData(payload)
        saveAvatar(avatar)
      }

      setAuthenticated('authenticated')
    },
    logout: () => {
      clearOAuthData()

      setAuthenticated('unauthenticated')
    },
    authenticated,
    setAuthenticated,
  }
}
