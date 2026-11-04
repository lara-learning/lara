import { ApolloLink, NextLink, Observable, Operation } from '@apollo/client'

import { getAccessToken } from '../helper/auth-helper'
import { useAuthentication } from './use-authentication'

export const isUnauthorizedNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const networkError = error as { statusCode?: unknown; response?: { status?: unknown } }

  if (typeof networkError.statusCode === 'number') {
    return networkError.statusCode === 401
  }

  return typeof networkError.response?.status === 'number' && networkError.response.status === 401
}

export const createAuthenticationLink = ({
  getAccessToken: readAccessToken,
  login,
  logout,
}: {
  getAccessToken: () => string | undefined
  login: () => void
  logout: () => void
}): ApolloLink =>
  new ApolloLink((operation: Operation, forward: NextLink) => {
    const authHeaders: Record<string, string> = {}
    const token = readAccessToken()

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

    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (response) => {
          const context = operation.getContext()
          const {
            response: { headers },
          } = context

          if (!headers) {
            observer.next(response)
            return
          }

          const authenticationHeader = headers.get(ENVIRONMENT.authHeader)
          if (authenticationHeader === null) {
            observer.next(response)
            return
          }

          const authenticated = authenticationHeader === 'true'

          if (authenticated) {
            login()
          } else {
            logout()
          }

          observer.next(response)
        },
        error: (error) => {
          if (isUnauthorizedNetworkError(error) && readAccessToken()) {
            logout()
          }
          observer.error(error)
        },
        complete: () => observer.complete(),
      })

      return () => subscription.unsubscribe()
    })
  })

export const useAuthenticationLink = (): ApolloLink => {
  const { logout, login } = useAuthentication()

  return createAuthenticationLink({
    getAccessToken,
    login: () => login(),
    logout,
  })
}
