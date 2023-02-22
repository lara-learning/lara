import {GqlResolvers, MentorContext} from '@lara/api'

import { alexaSkillLinked } from '../services/alexa.service'
import { avatar, username } from '../services/user.service'

export const mentorResolver: GqlResolvers<MentorContext> = {
  Mentor: {
    avatar,
    username,
    alexaSkillLinked,
  },
}
