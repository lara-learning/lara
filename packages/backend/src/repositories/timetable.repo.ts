import { GqlTimetableUpdateInput, GqlTimetable } from '@lara/api'
import {
  deleteItem,
  putItem,
  queryObjects,
  timetableTable,
  timetableTraineeIdIndex,
  updateObject,
  UpdateObjectOptions,
} from '../db'

/**
 * Get all timetables by traineeId
 * @param traineeId
 * @returns `GqlTimetable[]`
 */
export const timetablesByTrainee = async (traineeId: string): Promise<GqlTimetable[] | undefined> => {
  return queryObjects<GqlTimetable>(timetableTable, timetableTraineeIdIndex, { traineeId })
}

/**
 * Save timetable
 * @param timetable `GqlTimetable`
 * @returns `GqlTimetable | undefined`
 */
export const saveTimetable = (timetable: GqlTimetable): Promise<GqlTimetable | undefined> => {
  return putItem(timetableTable, timetable)
}

/**
 * Delete timetable by id
 * @param id timetableId
 * @returns `boolean` true by success
 */
export const deleteTimetable = (id: string): Promise<boolean> => {
  return deleteItem(timetableTable, { id: id })
}

/**
 * Updates timetable
 * @param updatedTimetable updated timetable `GqlTimetableUpdateInput`
 * @param options object with `updateKeys:string[]`
 * @returns `GqlTimetableUpdateInput`
 */
export const updateTimetable = async <T extends GqlTimetableUpdateInput>(
  updatedTimetable: T,
  options: UpdateObjectOptions<T>
): Promise<T> => {
  return updateObject(timetableTable, updatedTimetable, options)
}
