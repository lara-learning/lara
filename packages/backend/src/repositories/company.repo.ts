import { GqlCompany } from '@lara/api'

import { companyTabelName, getItem, scanItems } from '../db'

export const companies = async (limit?: number): Promise<GqlCompany[]> => {
  return scanItems<GqlCompany>(companyTabelName, { Limit: limit })
}

export const companyById = async (id: string): Promise<GqlCompany | undefined> => {
  return getItem(companyTabelName, { id })
}
