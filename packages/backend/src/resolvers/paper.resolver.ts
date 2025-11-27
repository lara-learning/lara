import { AuthenticatedContext, Fazit, GqlCursor, GqlPaperEntryInput, GqlResolvers } from '@lara/api'
import { generatePaper, generatePaperEntry } from '../services/paper.service'
import { deletePaper, paperById, papersByTrainer, savePaper, updatePaper } from '../repositories/paper.repo'
import { GraphQLError } from 'graphql'

export const paperResolver: GqlResolvers<AuthenticatedContext> = {
  Query: {
    getFazit: async (_parent, { id }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }
      if (!paper.fazit) {
        const newFazit: Fazit = {
          id,
          content: '',
          version: 0,
          cursorPositions: [],
          mentorDone: false,
          traineeDone: false,
        }
        const newPaper = await updatePaper(
          { ...paper, fazit: newFazit },
          {
            updateKeys: ['fazit'],
          }
        )
        return newPaper.fazit
      }
      return paper.fazit
    },
    getPaper: async (_parent, { id }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }
      return paper
    },
  },
  Mutation: {
    createPaper: async (_parent, { input }) => {
      return savePaper(generatePaper(input))
    },
    updatePaper: async (_parent, { input }) => {
      const briefing = input.briefing.map((entry: GqlPaperEntryInput) => generatePaperEntry(entry))
      return await updatePaper(
        { ...input, briefing },
        { updateKeys: ['briefing', 'feedbackTrainee', 'feedbackMentor', 'status'] }
      )
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
    didSendEmail: async (_parent, { id, didSendEmail }) => {
      const paper = await paperById(id)
      if (paper) {
        await updatePaper(
          {
            ...paper,
            didSendEmail,
          },
          { updateKeys: ['didSendEmail'] }
        )

        return { didSendEmail: true }
      }

      return { didSendEmail: false }
    },
    updateFazitCursorPos: async (_parent, { id, cursorPosition }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }

      const fazit = paper?.fazit

      const newFazit: Fazit = {
        id,
        content: fazit?.content ?? '',
        version: fazit?.version ?? 0,
        cursorPositions: [...(fazit?.cursorPositions ?? []), cursorPosition],
        mentorDone: fazit?.mentorDone ?? false,
        traineeDone: fazit?.traineeDone ?? false,
      }
      console.log('Updating Fazit before DB save:', newFazit)

      const cursorMap: Map<string, number> = new Map()
      fazit?.cursorPositions.forEach((cp) => {
        cursorMap.set(cp.owner, cp.position)
      })
      cursorMap.set(cursorPosition.owner, cursorPosition.position)

      const cursors: GqlCursor[] = []
      cursorMap.forEach((v, k) => {
        const cursor = {
          owner: k,
          position: v,
        }

        cursors.push(cursor)
      })

      const newPaper = await updatePaper(
        { ...paper, fazit: newFazit },
        {
          updateKeys: ['fazit'],
        }
      )

      return newPaper.fazit?.cursorPositions.filter((cp) => cp.owner !== cursorPosition.owner)[0]
    },
    updateFazit: async (_parent, { id, content, version, cursorPosition, mentorDone, traineeDone }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }

      const fazit = paper.fazit

      const newFazit: Fazit = {
        id,
        content,
        version,
        cursorPositions: fazit?.cursorPositions ?? [],
        mentorDone: mentorDone ?? fazit?.mentorDone ?? false,
        traineeDone: traineeDone ?? fazit?.traineeDone ?? false,
      }

      const cursorMap: Map<string, number> = new Map()

      const cursor: GqlCursor = {
        ...cursorPosition,
      }

      if (fazit === undefined) {
        newFazit.cursorPositions = [cursor]
        const newPaper = await updatePaper({ ...paper, fazit: newFazit }, { updateKeys: ['fazit'] })
        return { newFazit: newPaper.fazit!, success: true }
      } else {
        if (version >= fazit.version) {
          //const newContent = merge(fazit.content, content)
          const newContent = content
          newFazit.content = newContent
          fazit.cursorPositions.forEach((cp) => {
            cursorMap.set(cp.owner, cp.position)
          })
          cursorMap.set(cursor.owner, cursor.position)

          const cursors: GqlCursor[] = []
          cursorMap.forEach((v, k) => {
            const cursor = {
              owner: k,
              position: v,
            }

            cursors.push(cursor)
          })

          const newPaper = await updatePaper(
            { ...paper, fazit: newFazit },
            {
              updateKeys: ['fazit'],
            }
          )

          return { success: true, newFazit: newPaper.fazit! }
        } else {
          return {
            success: false,
            newFazit: fazit,
          }
        }
      }
    },
  },
}
