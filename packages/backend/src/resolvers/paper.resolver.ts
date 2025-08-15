import { AuthenticatedContext, GqlPaperEntryInput, GqlResolvers } from '@lara/api'
import { generatePaper, generatePaperEntry } from '../services/paper.service'
import { deletePaper, papersByTrainer, savePaper, updatePaper } from '../repositories/paper.repo'
import { GraphQLError } from 'graphql'

export const paperResolver: GqlResolvers<AuthenticatedContext> = {
  Mutation: {
    createPaper: async (_parent, { input }) => {
      return savePaper(generatePaper(input))
    },
    updatePaper: async (_parent, { input }) => {
      const briefing = input.briefing.map((entry: GqlPaperEntryInput) => generatePaperEntry(entry))
      return await updatePaper({ ...input, briefing }, { updateKeys: ['briefing'] })
    },
    deletePaper: async (_parent, { paperId }, { currentUser }) => {
      const papers = await papersByTrainer(currentUser.id)

      if (!papers) {
        throw new GraphQLError('current Trainer has no papers')
      }

      const paperById = papers.find((paper) => paper.id === paperId)

      if (!paperById) {
        throw new GraphQLError('PaperId belongs not to current Trainer')
      }
      const success = await deletePaper(paperById.id)
      if (!success) {
        throw new GraphQLError('current Trainer has no papers')
      }

      return papers.filter((paper) => paper.id !== paperId)
    },
  },
}
