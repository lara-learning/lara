import { TokenRefreshLink } from 'apollo-link-token-refresh'

import { BackendUrl } from '../apollo-provider'
import { accessTokenValid, getAccessToken, getRefreshToken } from '../helper/auth-helper'
import { useAuthentication } from './use-authentication'

export type TokensResponse = {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

export const useTokenRefreshLink = (): TokenRefreshLink => {
  const { login, logout } = useAuthentication()

  return new TokenRefreshLink({
    // Indicates the current state of access token expiration
    // If token not yet expired or user doesn't have a token (guest) true should be returned
    isTokenValidOrUndefined: async () => {
      const token = getAccessToken()

      // If there is no token, the user is not logged in
      // We return true here, because there is no need to refresh the token
      if (!token) return true

      // Return true if the token is still valid, otherwise false and trigger a token refresh
      return accessTokenValid()
    },
    // Responsible for fetching refresh token
    fetchAccessToken: async () => {
      const refreshToken = getRefreshToken() ?? ''

      return fetch(`${BackendUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          authorization: 'allow',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      }).then((res) => res.json())
    },
    handleFetch: () => {
      // noop because we save the token already in the handle response fc
    },
    handleResponse: (_operation, _accessTokenField) => (response: TokensResponse) => {
      login({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
      })

      return response
    },
    handleError: (err) => {
      console.warn('Your refresh token is invalid. Try to reauthenticate.')
      console.error(err)

      logout()
    },
  })
}
