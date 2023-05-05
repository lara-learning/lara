import {
  AuthenticatedContext,
  GqlPaperEntryInput,
  GqlResolvers,
} from '@lara/api'
import {generatePaper, generatePaperEntry} from "../services/paper.service";
import {savePaper, updatePaper} from "../repositories/paper.repo";
import {sendPaperBriefingMail} from "../services/email.service";

export const paperResolver: GqlResolvers<AuthenticatedContext> = {
  Mutation: {
    createPaper: async (_parent, { input}) => {
      return savePaper(generatePaper(input))
    },
    updatePaper: async (_parent, {input}, { currentUser }) => {
      const briefing = input.briefing.map((entry: GqlPaperEntryInput) => generatePaperEntry(entry))
      if(currentUser.__typename == 'Trainer') await sendPaperBriefingMail(input, currentUser)
      return await updatePaper({...input, briefing}, {updateKeys: ['briefing']})
    },
  },
}
