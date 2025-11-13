import { AuthenticatedContext, Fazit, GqlCursor, GqlPaperEntryInput, GqlResolvers } from '@lara/api'
import { generatePaper, generatePaperEntry } from '../services/paper.service'
import { deletePaper, paperById, papersByTrainer, savePaper, updatePaper } from '../repositories/paper.repo'
import { GraphQLError } from 'graphql'

function merge(str1: string, str2: string): string {
  if (!str1) return str2
  if (!str2) return str1

  let longestCommon = ''
  let positionInStr1 = 0

  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str2.length; j++) {
      let k = 0
      while (i + k < str1.length && j + k < str2.length && str1[i + k] === str2[j + k]) {
        k++
      }

      if (k > longestCommon.length) {
        longestCommon = str1.substring(i, i + k)
        positionInStr1 = i
      }
    }
  }

  if (longestCommon === '') {
    return str1 + str2
  }

  const positionInStr2 = str2.indexOf(longestCommon)

  const prefixFromStr1 = str1.substring(0, positionInStr1)
  const suffixFromStr2 = str2.substring(positionInStr2 + longestCommon.length)

  return prefixFromStr1 + longestCommon + suffixFromStr2
}

export const paperResolver: GqlResolvers<AuthenticatedContext> = {
  Query: {
    getFazit: async (_parent, { id }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }
      const newFazit: Fazit = {
        id,
        content: '',
        version: 0,
        cursorPositions: [],
      }
      const newPaper = await updatePaper(
        { ...paper, fazit: newFazit },
        {
          updateKeys: ['fazit'],
        }
      )
      return newPaper.fazit
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
      }

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
    updateFazit: async (_parent, { id, content, version, cursorPosition }) => {
      const paper = await paperById(id)
      if (!paper) {
        throw new GraphQLError('Paper does not exist')
      }

      const fazit = paper.fazit

      const newFazit: Fazit = {
        id,
        content,
        version,
        cursorPositions: [],
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
          const newContent = merge(fazit.content, content)
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

          return { newFazit: newPaper.fazit ?? fazit, success: true }
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
