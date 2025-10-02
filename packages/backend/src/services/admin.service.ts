import { v4 } from 'uuid'

import { Admin } from '@lara/api'
import { deleteUser } from '../repositories/user.repo'

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
    notification: true,
  }
}

/**
 * Deletes a admin and all it's references from the DB
 * @param admin Admin to delete
 * @returns Boolean indicating success
 */
export const deleteAdmin = async (admin: Admin): Promise<boolean> => {
  const deleteAdminSuccess = await deleteUser(admin)

  return deleteAdminSuccess
}

/**
 * Validates that the admin attributes are all
 * correct. Throws an error if not
 * @param _admin Admin to validate
 */
export const validateAdmin = async (_admin: Admin): Promise<void> => {
  // function for validations in the future
}
