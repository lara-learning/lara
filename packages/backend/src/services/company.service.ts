import { GraphQLError } from 'graphql'

import { GqlCompany } from '@lara/api'

import { companies, companyById } from '../repositories/company.repo'

/**
 * Checks if the given string is a valid company id
 * @param id String to validate
 */
export const validateCompanyId = async (id: string): Promise<void> => {
  const comp = await companyById(id)

  if (!comp) {
    throw new GraphQLError('Wrong Company Id')
  }
}

/**
 * Gets the first Company from the DB
 * @returns Company
 */
export const defaultCompany = async (): Promise<GqlCompany> => {
  const [company] = await companies(1)
  return company
}

/**
 * Get company from DB or fallback to default company
 * @param id Possible id of company
 * @returns Company
 */
export const company = async (id?: string): Promise<GqlCompany> => {
  if (!id) {
    return defaultCompany()
  }

  return companyById(id).then((comp) => comp ?? defaultCompany())
}
