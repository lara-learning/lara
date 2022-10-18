import { Admin } from '@lara/api'

import { queryObjects, userTableName, userTypeIndex } from '../db'

export const allAdmins = async (): Promise<Admin[]> => {
  return queryObjects<Admin>(userTableName, userTypeIndex, { type: 'Admin' })
}
