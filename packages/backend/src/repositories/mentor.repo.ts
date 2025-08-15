import { Mentor } from '@lara/api'

import { queryObjects, userTableName, userTypeIndex } from '../db'
import { userById } from './user.repo'

export const allMentors = async (): Promise<Mentor[]> => {
  return queryObjects<Mentor>(userTableName, userTypeIndex, { type: 'Mentor' })
}

export const mentorById = async (id: string): Promise<Mentor | undefined> => {
  const user = await userById<Mentor>(id)
  return user?.type === 'Mentor' ? user : undefined
}
