import { ApolloLink, NextLink, Operation } from '@apollo/client'

import { getAccessToken } from '../helper/auth-helper'
import { useAuthentication } from './use-authentication'

export const useAuthenticationLink = (): ApolloLink => {
  const { logout, login } = useAuthentication()

  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const authHeaders: Record<string, string> = {}
    const token = getAccessToken()

    // Fallback to allow so the AWS API Gateway token authorizer doesn't block the request
    authHeaders['Authorization'] = token ? `Bearer ${token}` : 'allow'

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

      const authenticated: boolean = JSON.parse(headers.get(ENVIRONMENT.authHeader))

      if (authenticated) {
        login()
      } else {
        logout()
      }

      return response
    })
  })
}
