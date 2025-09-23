import { v4 } from 'uuid'

import { Admin } from '@lara/api'

type GenerateAdminOptions = {
  firstName: string
  lastName: string
  email: string
}

/**
 * Generates a new admin object
 * @param options Generation options
 * @returns New Admin
 */
export const generateAdmin = (options: GenerateAdminOptions): Admin => {
  return {
    ...options,
    id: v4(),
    createdAt: new Date().toISOString(),
    type: 'Admin',
  }
}

/**
 * Validates that the trainer attributes are all
 * correct. Throws an error if not
 * @param _trainer Trainer to validate
 */
export const validateAdmin = async (_trainer: Admin): Promise<void> => {
  // function for validations in the future
}
