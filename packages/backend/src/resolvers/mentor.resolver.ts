import { GqlResolvers, Mentor, MentorContext } from '@lara/api'

import { alexaSkillLinked } from '../services/alexa.service'
import { avatar, username } from '../services/user.service'
import { parseISODateString } from '../utils/date'
import { papersByMentor } from '../repositories/paper.repo'

export const mentorResolver: GqlResolvers<MentorContext> = {
  Mentor: {
    avatar,
    username,
    alexaSkillLinked,
    deleteAt: (model) => model.endDate,
    papers: async (model) => {
      return papersByMentor(model.id)
    },
  },
}
export const endOfToolUsage = (mentor: Mentor): Date => {
  const endDate = mentor.endDate ? parseISODateString(mentor.endDate) : ''
  return <Date>endDate
}
