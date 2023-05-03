import {v4} from 'uuid'

import {
  GqlPaper, GqlPaperEntryInput,
  GqlPaperFormData,
  GqlPaperInput,
  Paper
} from '@lara/api'
import {PaperFormData} from "@lara/frontend/lib/graphql";


export const briefingEntries = (paper: Paper): PaperFormData[] => paper.briefing
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
