import { gql } from 'graphql-request'

import { GqlMutationUpdateReportArgs, GqlReport, GqlTrainee } from '@lara/api'

import { getGQLClient } from './client'

type MutationResponse = {
  updateReport: {
    report: Pick<GqlReport, 'id'>
    trainee: Pick<GqlTrainee, 'id'>
  }
}

const mutation = gql`
  mutation updateReport($id: ID!, $summary: String, $department: String, $status: String) {
    updateReport(id: $id, summary: $summary, department: $department, status: $status) {
      report {
        id
      }
      trainee {
        id
      }
    }
  }
`

export const updateReport = async (options: GqlMutationUpdateReportArgs): Promise<boolean> => {
  const gqlClient = getGQLClient()

  return gqlClient
    .request<MutationResponse, GqlMutationUpdateReportArgs>(mutation, options)
    .then((res) => Boolean(res.updateReport))
    .catch(() => false)
}
