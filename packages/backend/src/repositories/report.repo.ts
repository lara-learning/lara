import { WriteRequest } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Report } from '@lara/api'

import {
  batchWriteItem,
  getItem,
  putItem,
  queryObjects,
  reportTableName,
  reportWeekTraineeIdIndex,
  updateObject,
  UpdateObjectOptions,
} from '../db'
import { chunk } from '../utils/array'

export const updateReport = async (updatedReport: Report, options: UpdateObjectOptions<Report>): Promise<Report> => {
  return updateObject(reportTableName, updatedReport, options)
}

export const saveReport = (report: Report): Promise<Report> => {
  return putItem(reportTableName, report)
}

export const deleteReports = async (reports: Report[]): Promise<boolean> => {
  const deleteRequests: WriteRequest[] = reports.map((report) => ({
    DeleteRequest: {
      Key: marshall({
        id: report.id,
      }),
    },
  }))

  const deleteRequestChunks = chunk(deleteRequests, 25)

  const responses = await Promise.all(
    deleteRequestChunks.map((request) => batchWriteItem({ [reportTableName]: request }))
  )

  return !responses.includes(false)
}

export const reportById = (id: string): Promise<Report | undefined> => {
  return getItem(reportTableName, { id })
}

export const reportByYearAndWeek = async (
  year: number,
  week: number,
  traineeId: string
): Promise<Report | undefined> => {
  const reports = await queryObjects<Report>(reportTableName, reportWeekTraineeIdIndex, { traineeId, week }, { year })

  return reports[0]
}
