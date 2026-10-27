import { ApolloLink, NextLink, Operation } from '@apollo/client'

import { getAccessToken } from '../helper/auth-helper'
import { useAuthentication } from './use-authentication'

export const useAuthenticationLink = (): ApolloLink => {
  const { logout, login } = useAuthentication()

  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const authHeaders: Record<string, string> = {}
    const token = getAccessToken()

    if (token) {
      authHeaders.Authorization = `Bearer ${token}`
    } else {
      logout()
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...authHeaders,
      },
    }))

    return forward(operation).map((response) => {
      const context = operation.getContext()
      const {
        response: { headers },
      } = context

      if (!headers) {
        return response
      }

      const authenticationHeader = headers.get(ENVIRONMENT.authHeader)
      if (authenticationHeader === null) {
        return response
      }

      const authenticated = authenticationHeader === 'true'

      if (authenticated) {
        login()
      } else {
        logout()
      }

      return response
    })
  })
}
