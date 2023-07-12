import { GqlResolvers, TraineeContext } from '@lara/api'
import {
  fillReportWithTimetable,
  generateTimetable,
  generateTimetableEntry,
  timetableByReport,
} from '../services/timetable.service'
import { deleteTimetable, saveTimetable, timetablesByTrainee, updateTimetable } from '../repositories/timetable.repo'
import { GraphQLError } from 'graphql'
import { reportById, updateReport } from '../repositories/report.repo'
import { traineeById } from '../repositories/trainee.repo'

export const timetableTraineeResolver: GqlResolvers<TraineeContext> = {
  Mutation: {
    createTimetable: async (_parent, { input }, { currentUser }) => {
      await saveTimetable(generateTimetable(input))
      return traineeById(currentUser.id)
    },
    deleteTimetable: async (_parent, { timetableId }, { currentUser }) => {
      const timetables = await timetablesByTrainee(currentUser.id)

      if (!timetables) {
        throw new GraphQLError('current Trainee has no timetable')
      }

      const timetableById = timetables.find((timetable) => timetable.id === timetableId)

      if (!timetableById) {
        throw new GraphQLError('TimetableId belongs not to current Trainee')
      }
      const success = await deleteTimetable(timetableId)
      if (!success) {
        throw new GraphQLError('current Trainee has no timetable')
      }

      return traineeById(currentUser.id)
    },
    updateTimetable: async (_parent, { input }, { currentUser }) => {
      if (input.traineeId !== currentUser.id) {
        throw new GraphQLError('TimetableId belongs not to current Trainee')
      }

      const entries = input.entries.map((entry) => generateTimetableEntry(entry))

      updateTimetable({ ...input, entries }, { updateKeys: ['dateEnd', 'dateStart', 'entries', 'title'] })

      return traineeById(currentUser.id)
    },
    autoFillReport: async (_parent, { reportId }, { currentUser }) => {
      if (!currentUser.timetableSettings?.preFillClass) {
        throw new GraphQLError('PreFillClass is not enabled in userSettings')
      }

      const report = await reportById(reportId)
      if (!report || report.traineeId !== currentUser.id) {
        throw new GraphQLError('Report does not exists')
      }

      const timetable = await timetableByReport(currentUser.id, report)
      if (!timetable) {
        throw new GraphQLError('Timetable does not exists')
      }

      const updatedReport = fillReportWithTimetable(report, timetable)

      return updateReport(updatedReport, { updateKeys: ['days'] })
    },
    deleteTimetableEntry: async (_parent, { timetableId, input }, { currentUser }) => {
      const timetables = await timetablesByTrainee(currentUser.id)

      if (!timetables) {
        throw new GraphQLError('current Trainee has no timetable')
      }

      const timetableById = timetables.find((timetable) => timetable.id === timetableId)

      if (!timetableById) {
        throw new GraphQLError('timetable does not exist')
      }

      const entryToDelete = timetableById?.entries.find(
        (entry) => entry.day === input.day && entry.timeStart === input.timeStart
      )

      if (!entryToDelete) {
        throw new GraphQLError('entry does not exist')
      }

      const updatedTimetable = {
        ...timetableById,
        entries: timetableById?.entries.filter((entry) => entry !== entryToDelete),
      }

      await updateTimetable(updatedTimetable, { updateKeys: ['entries'] })

      return traineeById(currentUser.id)
    },
  },
}
