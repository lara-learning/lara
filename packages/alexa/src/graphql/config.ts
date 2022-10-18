import { gql } from 'graphql-request'

import { GqlLaraConfig } from '@lara/api'

import { getGQLClient } from './client'

let cacheConfig: GqlLaraConfig | undefined

type QueryResponse = {
  config: GqlLaraConfig
}

const query = gql`
  query config {
    config {
      minWorkDayMinutes
      maxWorkDayMinutes
      expectedWorkDayMinutes

      minEducationDayMinutes
      maxEducationDayMinutes

      maxEntryMinutes

      maxPeriodYearsCount

      finishedWeekDayCount
    }
  }
`

export const getLaraConfig = async (): Promise<GqlLaraConfig | undefined> => {
  if (cacheConfig) {
    return cacheConfig
  }

  const gqlClient = getGQLClient()

  return gqlClient
    .request<QueryResponse>(query)
    .then((res) => {
      cacheConfig = res.config
      return cacheConfig
    })
    .catch((e) => {
      console.log('Get current user error: ', e)
      return undefined
    })
}
