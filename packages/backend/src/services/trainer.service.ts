import { v4 } from 'uuid'

import { Trainer } from '@lara/api'

import { deleteTrainerReferences } from '../repositories/trainer.repo'
import { deleteUser } from '../repositories/user.repo'

type GenerateTrainerOptions = {
  firstName: string
  lastName: string
  email: string
  companyId?: string
}

/**
 * Generates a new trainer object.
 * The trainer isn't saved to the DB yet
 * @param options Generate Options
 * @returns New Trainer
 */
export const generateTrainer = async (options: GenerateTrainerOptions): Promise<Trainer> => {
  const trainer: Trainer = {
    id: v4(),
    createdAt: new Date().toISOString(),
    type: 'Trainer',
    ...options
  }

  await validateTrainer(trainer)

  return trainer
}

/**
 * Validates that the trainer attributes are all
 * correct. Throws an error if not
 * @param _trainer Trainer to validate
 */
export const validateTrainer = async (_trainer: Trainer): Promise<void> => {
  // function for validations in the future
}

/**
 * Deletes a trainer and all it's references from the DB
 * @param trainer Trainer to delete
 * @returns Boolean indicating success
 */
export const deleteTrainer = async (trainer: Trainer): Promise<boolean> => {
  const deleteTrainerIdSuccess = await deleteTrainerReferences(trainer)
  const deleteTrainerSuccess = await deleteUser(trainer)

  return !deleteTrainerIdSuccess.includes(false) || deleteTrainerSuccess
}
