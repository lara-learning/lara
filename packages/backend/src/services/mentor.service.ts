import { v4 } from 'uuid'

import {Mentor} from '@lara/api'

import { deleteUser } from '../repositories/user.repo'

type GenerateMentorOptions = {
  firstName: string
  lastName: string
  email: string
}

/**
 * Generates a new mentor object.
 * The mentor isn't saved to the DB yet
 * @param options Generate Options
 * @returns New Mentor
 */
export const generateMentor = async (options: GenerateMentorOptions): Promise<Mentor> => {
  const mentor: Mentor = {
    id: v4(),
    createdAt: new Date().toISOString(),
    type: 'Mentor',
    ...options,
  }

  await validateMentor(mentor)

  return mentor
}

/**
 * Validates that the mentor attributes are all
 * correct. Throws an error if not
 * @param _mentor Mentor to validate
 */
export const validateMentor = async (_mentor: Mentor): Promise<void> => {
  // function for validations in the future
}

/**
 * Deletes a mentor and all it's references from the DB
 * @param trainer Mentor to delete
 * @returns Boolean indicating success
 */
export const deleteMentor = async (mentor: Mentor): Promise<boolean> => {
  const deleteMentorSuccess = await deleteUser(mentor)

  return deleteMentorSuccess
}
