import { alexaResolver } from './alexa.resolver'
import { adminResolver, traineeAdminResolver, trainerAdminResolver, mentorAdminResolver } from './admin.resolver'
import { authResolver } from './auth.resolver'
import { commentResolver } from './comment.resolver'
import { configResolver } from './config.resolver'
import { dayResolver, dayTraineeResolver } from './day.resolver'
import { entryTraineeResolver } from './entry.resolver'
import { paperResolver } from './paper.resolver'
import { reportResolver, reportTraineeResolver } from './report.resolver'
import { traineeResolver, traineeTraineeResolver } from './trainee.resolver'
import { trainerResolver } from './trainer.resolver'
import { userResolver } from './user.resolver'
import { mentorResolver } from './mentor.resolver'

export const resolvers = [
  configResolver,

  commentResolver,

  dayResolver,
  dayTraineeResolver,

  entryTraineeResolver,

  reportResolver,
  reportTraineeResolver,

  traineeTraineeResolver,
  traineeResolver,

  trainerResolver,

  mentorResolver,

  userResolver,
  authResolver,

  adminResolver,
  traineeAdminResolver,
  trainerAdminResolver,
  mentorAdminResolver,

  alexaResolver,
  paperResolver,
]
