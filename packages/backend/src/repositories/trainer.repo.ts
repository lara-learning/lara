import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Trainer } from '@lara/api'

import { queryObjects, userTableName, userTypeIndex, batchWriteItem } from '../db'
import { userById } from './user.repo'
import { chunk } from '../utils/array'
import { traineesByTrainerId } from './trainee.repo'

export const allTrainers = async (): Promise<Trainer[]> => {
  return queryObjects<Trainer>(userTableName, userTypeIndex, { type: 'Trainer' })
}

export const trainerById = async (id: string): Promise<Trainer | undefined> => {
  const user = await userById<Trainer>(id)
  return user?.type === 'Trainer' ? user : undefined
}

export const deleteTrainerReferences = async (trainer: Trainer): Promise<boolean[]> => {
  const trainees = await traineesByTrainerId(trainer.id)

  const putRequests: DocumentClient.WriteRequests = trainees.map((trainee) => ({
    PutRequest: {
      Item: {
        ...trainee,
        trainerId: undefined,
      },
    },
  }))

  const putRequestChunks = chunk(putRequests, 25)

  return Promise.all(putRequestChunks.map((batch) => batchWriteItem({ [userTableName]: batch })))
}
