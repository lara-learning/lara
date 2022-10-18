import { gql } from 'graphql-request'

import { GqlEntry, GqlDay, GqlMutationCreateEntryArgs, GqlReport } from '@lara/api'

import { getGQLClient } from './client'

type MutationResponse = {
  createEntry: {
    day: Pick<GqlDay, 'id'>
    entry: Pick<GqlEntry, 'id'>
    report: Pick<GqlReport, 'id'>
  }
}

const mutation = gql`
  mutation createEntry($dayId: String!, $input: EntryInput!) {
    createEntry(dayId: $dayId, input: $input) {
      day {
        id
      }
      entry {
        id
      }
      report {
        id
      }
    }
  }
`

export const createEntry = async (dayId: string, text: string, time: number): Promise<boolean> => {
  const gqlClient = getGQLClient()

  return gqlClient
    .request<MutationResponse, GqlMutationCreateEntryArgs>(mutation, {
      dayId: dayId,
      input: { text, time },
    })
    .then((res) => Boolean(res.createEntry))
    .catch(() => false)
}
