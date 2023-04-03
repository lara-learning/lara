import {GqlResolvers, Mentor, MentorContext} from '@lara/api'

import {alexaSkillLinked} from '../services/alexa.service'
import {avatar, username} from '../services/user.service'
import {parseISODateString} from "../utils/date";

export const mentorResolver: GqlResolvers<MentorContext> = {
  Mentor: {
    avatar,
    username,
    alexaSkillLinked,
    deleteAt: (model) => endOfToolUsage(model).toISOString(),
  },
}
//TODO endDate wird nicht gesetzt
export const endOfToolUsage = (mentor: Mentor): Date => {
  const endDate = mentor.endDate ? parseISODateString(mentor.endDate) : new Date()
  console.log(endDate)

  return <Date>endDate;
}
