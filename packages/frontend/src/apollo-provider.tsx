import React from 'react'

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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

const ApolloProvider: React.FunctionComponent = ({ children }) => {
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
        User: ['Trainee', 'Trainer'],
        Timetable: ['TimetableEntry'],
      },
      typePolicies: {
        Day: {
          fields: {
            entries: {
              merge(_, incoming) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return incoming
              },
            },
          },
        },
        Timetable: {
          keyFields: ['id'],
          fields: {
            entries: {
              merge(_, incoming) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return incoming
              },
            },
          },
        },
        TimetableEntry: {
          keyFields: ['day', 'timeStart'],
        },
      },
    }),
  })

  return <NativeApolloProvider client={client}>{children}</NativeApolloProvider>
}

export default ApolloProvider
