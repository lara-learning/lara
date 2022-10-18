import { GraphQLClient } from 'graphql-request'

const { BACKEND_URL } = process.env

if (!BACKEND_URL) {
  throw new Error("Missing Env Variable: 'BACKEND_URL'")
}

let client: GraphQLClient | undefined

export const initGQLClient = (token?: string): GraphQLClient => {
  client = new GraphQLClient(`${BACKEND_URL}/backend`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  return client
}

export const getGQLClient = (): GraphQLClient => {
  if (!client) {
    return initGQLClient()
  }

  return client
}
