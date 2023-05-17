import { v4 } from 'uuid'

import { GqlPaper, GqlPaperEntryInput, GqlPaperFormData, GqlPaperInput } from '@lara/api'

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
  }
}
