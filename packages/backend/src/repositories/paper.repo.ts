import { Paper, Report } from '@lara/api'

import { deleteItem, getItem, paperTableName, putItem, updateObject, UpdateObjectOptions } from '../db'

export const updatePaper = async (updatedPaper: Paper, options: UpdateObjectOptions<Paper>): Promise<Paper> => {
  return updateObject(paperTableName, updatedPaper, options)
}

export const savePaper = (paper: Paper): Promise<Paper> => {
  return putItem(paperTableName, paper)
}

export const deletePaper = async (paper: Paper): Promise<boolean> => {
  return deleteItem(paperTableName, { id: paper.id })
}

export const paperById = (id: string): Promise<Report | undefined> => {
  return getItem(paperTableName, { id })
}
