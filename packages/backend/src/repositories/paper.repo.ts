import {GqlPaper, GqlPaperUpdateInput, Paper} from '@lara/api'

import {
  deleteItem, paperMentorIdIndex,
  paperTableName, paperTraineeIdIndex, paperTrainerIdIndex,
  putItem, queryObjects,
  updateObject,
  UpdateObjectOptions, getItem
} from '../db'

export const updatePaper = async (updatedPaper: GqlPaperUpdateInput, options: UpdateObjectOptions<GqlPaperUpdateInput>): Promise<GqlPaperUpdateInput> => {
  return updateObject(paperTableName, updatedPaper, options)
}

export const savePaper = (paper: GqlPaper): Promise<GqlPaper> => {
  return putItem(paperTableName, paper)
}

export const deletePaper = async (paper: Paper): Promise<boolean> => {
  return deleteItem(paperTableName, { id: paper.id })
}

export const papersById = (id: string): Promise<Paper | undefined> => {
  return getItem(paperTableName, { id })
}

export const papersByTrainee = (traineeId: string): Promise<GqlPaper[] | undefined> => {
   return queryObjects<GqlPaper>(paperTableName, paperTraineeIdIndex, { traineeId })
}
export const papersByTrainer = (trainerId: string): Promise<GqlPaper[] | undefined> => {
   return queryObjects<GqlPaper>(paperTableName, paperTrainerIdIndex, { trainerId })
}
export const papersByMentor = (mentorId: string): Promise<GqlPaper[] | undefined> => {
   return queryObjects<GqlPaper>(paperTableName, paperMentorIdIndex, { mentorId })
}
