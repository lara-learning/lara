import {
  BaseContext,
  GqlResolvers,
} from '@lara/api'
import {generatePaper} from "../services/paper.service";
import {savePaper} from "../repositories/paper.repo";

export const paperResolver: GqlResolvers<BaseContext> = {
  Mutation: {
    createPaper: async (_parent, { input}) => {
      return savePaper(generatePaper(input))
    },
    /*updatePaper: async (_parent, {input}) => {
      const briefing = input.briefing.map((entry: GqlPaperEntryInput) => generatePaperEntry(entry))
      return await updatePaper({...input, briefing}, {updateKeys: ['briefing']})
    },
    deletePaperEntry: async (_parent, { paperId, input }, { currentUser }) => {
      const paper = await paperByTrainer(currentUser.id)

      if (!paper) {
        throw new GraphQLError('current Trainee has no timetable')
      }

      const paperById = paper.find((paper) => paper.id === paperId)

      if (!paperById) {
        throw new GraphQLError('timetable does not exist')
      }

      const entryToDelete = paperById?.entries.find(
        (entry) => entry.day === input.day && entry.timeStart === input.timeStart
      )

      if (!entryToDelete) {
        throw new GraphQLError('entry does not exist')
      }

      const updatedPaper = {
        ...paperById,
        entries: paperById?.entries.filter((entry) => entry !== entryToDelete),
      }

      await updatePaper(updatedPaper, { updateKeys: ['briefing'] })

      return traineeById(currentUser.id)
    },*/
  },
}
