import {GqlPaper, GqlPaperUpdateInput, Paper} from '@lara/api'

import {
  deleteItem,
  paperTableName,
  putItem,
  updateObject,
  UpdateObjectOptions
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

// export const papersByTrainee = (trainee: string): Promise<GqlPaper[] | undefined> => {
//   return queryObjects<GqlPaper>(paperTableName, paperTraineeId, { trainee })
// }
