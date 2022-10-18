import { gql } from 'graphql-request'

import { GqlUserInterface } from '@lara/api'

import { getGQLClient } from './client'

type QueryResponse = {
  currentUser: Pick<GqlUserInterface, 'id'>
}

const query = gql`
  query getCurrentUser {
    currentUser {
      id
    }
  }
`

export const getCurrentUser = async (): Promise<Pick<GqlUserInterface, 'id'> | undefined> => {
  const gqlClient = getGQLClient()

  return gqlClient
    .request<QueryResponse>(query)
    .then((res) => res.currentUser)
    .catch((e) => {
      console.log('Get current user error: ', e)
      return undefined
    })
}
