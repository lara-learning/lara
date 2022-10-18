import { gql } from 'graphql-request'

import { GqlDay, GqlDayStatusEnum, GqlMutationUpdateDayArgs } from '@lara/api'

import { getGQLClient } from './client'

type MutationResponse = {
  updateDay: Pick<GqlDay, 'id'>
}

const mutation = gql`
  mutation updateDay($status: String!, $id: ID!) {
    updateDay(status: $status, id: $id) {
      id
    }
  }
`

export const statusIdToDayStatus = (status: string): GqlDayStatusEnum => {
  switch (status) {
    case 'SCHOOL':
      return 'education'
    case 'SICK':
      return 'sick'
    case 'VACATION':
      return 'vacation'
    case 'WORK':
      return 'work'
  }

  return 'work'
}

export const dayStatusToText = (status: GqlDayStatusEnum): string => {
  switch (status) {
    case 'education':
      return 'Schule'
    case 'sick':
      return 'Krank'
    case 'vacation':
      return 'Urlaub'
    case 'work':
      return 'Arbeit'
  }

  return 'Arbeit'
}

export const updateDay = async (dayId: string, status: GqlDayStatusEnum): Promise<Pick<GqlDay, 'id'> | undefined> => {
  const gqlClient = getGQLClient()

  return gqlClient
    .request<MutationResponse, GqlMutationUpdateDayArgs>(mutation, {
      id: dayId,
      status,
    })
    .then((res) => res.updateDay)
    .catch(() => undefined)
}
