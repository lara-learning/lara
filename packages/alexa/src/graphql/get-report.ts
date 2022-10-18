import { gql } from 'graphql-request'

import { GqlReport, GqlDay, GqlEntry } from '@lara/api'

import { getGQLClient } from './client'

export type ReportResponse = Pick<GqlReport, 'id' | 'department' | 'summary' | 'status' | 'week' | 'year'> & {
  days: DayResponse[]
}

export type DayResponse = Pick<GqlDay, 'id' | 'date' | 'status'> & { entries: EntryResponse[] }

export type EntryResponse = Pick<GqlEntry, 'id' | 'time'>

type QueryResponse = {
  reportForYearAndWeek: ReportResponse
}

const query = gql`
  query getReport($year: Int!, $week: Int!) {
    reportForYearAndWeek(year: $year, week: $week) {
      id
      department
      summary
      status
      week
      year
      days {
        id
        date
        status
        entries {
          id
          time
        }
      }
    }
  }
`

export const getReportByYearAndWeek = async (year: number, week: number): Promise<ReportResponse | undefined> => {
  const client = getGQLClient()

  return client
    .request<QueryResponse>(query, {
      year,
      week,
    })
    .then((res) => res.reportForYearAndWeek)
    .catch((e) => {
      console.log('Report by year and week error ', e)
      return undefined
    })
}
