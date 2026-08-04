import { v4 } from 'uuid'

import { GqlPaper, GqlPaperEntryInput, GqlPaperFormData, GqlPaperInput, GqlPaperUpdateInput } from '@lara/api'

export const countPaperComments = (entries: GqlPaperFormData[] | undefined): number =>
  (entries ?? []).reduce((sum, entry) => sum + (entry.comments?.length ?? 0), 0)

export const hasPaperCommentsIncreased = (existing: GqlPaper, input: GqlPaperUpdateInput): boolean => {
  const existingCount = countPaperComments(existing.feedbackTrainee) + countPaperComments(existing.feedbackMentor)
  const newCount = countPaperComments(input.feedbackTrainee) + countPaperComments(input.feedbackMentor)

  return newCount > existingCount
}

export const generatePaperEntry = (entryInput: GqlPaperEntryInput): GqlPaperFormData => {
  return {
    ...entryInput,
  }
}
export const generatePaper = (paperInput: GqlPaperInput): GqlPaper => {
  return {
    id: v4(),
    createdAt: new Date().toISOString(),
    ...paperInput,
    briefing: paperInput.briefing.map((entry) => generatePaperEntry(entry)),
    feedbackTrainee: paperInput.feedbackTrainee.map((entry) => generatePaperEntry(entry)),
    feedbackMentor: paperInput.feedbackMentor.map((entry) => generatePaperEntry(entry)),
  }
}
