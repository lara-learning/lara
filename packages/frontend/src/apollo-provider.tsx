import React, { ReactNode } from 'react'

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as NativeApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import { useAuthenticationLink } from './hooks/use-authentication-link'
import { useTokenRefreshLink } from './hooks/use-token-refresh-link'

export const BackendUrl = `${ENVIRONMENT.backendUrl}/backend`

interface ApolloProviderProps {
  children: ReactNode
}

const ApolloProvider: React.FunctionComponent<ApolloProviderProps> = ({ children }) => {
  const authenticationLink = useAuthenticationLink()
  const refreshTokenLink = useTokenRefreshLink()

  const api = new HttpLink({
    uri: BackendUrl,
    credentials: 'include',
  })

  const client = new ApolloClient({
    link: ApolloLink.from([refreshTokenLink, authenticationLink, api]),
    cache: new InMemoryCache({
      possibleTypes: {
        ['User']: ['Trainee', 'Trainer'],
      },
      typePolicies: {
        Day: {
          fields: {
            entries: {
              merge(_, incoming) {
                return incoming
              },
            },
          },
        },
      },
    }),
  })

  return <NativeApolloProvider client={client}>{children}</NativeApolloProvider>
}

export default ApolloProvider
