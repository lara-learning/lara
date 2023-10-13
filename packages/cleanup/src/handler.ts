import { CloudWatchLogsHandler } from 'aws-lambda'
import { gql, GraphQLClient } from 'graphql-request'

const { BACKEND_URL } = process.env

if (!BACKEND_URL) {
  throw new Error('Missing Env Variable')
}

const client = new GraphQLClient(`${BACKEND_URL}/backend`, {
  headers: {
    Authorization: 'allow',
  },
})

const query = gql`
  query cleanup {
    cleanup
  }
`

export const handler: CloudWatchLogsHandler = async () => {
  return await client.request(query)
}
