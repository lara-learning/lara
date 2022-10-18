import { Trainee } from '@lara/api'

import { queryObjects, userTableName, userTrainerIdIndex, userTypeIndex } from '../db'
import { reportById } from './report.repo'
import { userById } from './user.repo'

export const traineeById = async (id: string): Promise<Trainee | undefined> => {
  const user = await userById<Trainee>(id)
  return user?.type === 'Trainee' ? user : undefined
}

export const traineeByReportId = async (reportId: string): Promise<Trainee | undefined> => {
  const report = await reportById(reportId)

  if (!report) {
    return
  }

  return traineeById(report.traineeId)
}

export const allTrainees = async (): Promise<Trainee[]> => {
  return queryObjects<Trainee>(userTableName, userTypeIndex, { type: 'Trainee' })
}

export const traineesByTrainerId = async (trainerId: string): Promise<Trainee[] | []> => {
  return queryObjects<Trainee>(userTableName, userTrainerIdIndex, { trainerId })
}
