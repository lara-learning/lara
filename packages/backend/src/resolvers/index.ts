import { alexaResolver } from './alexa.resolver'
import { adminResolver, traineeAdminResolver, trainerAdminResolver } from './admin.resolver'
import { authResolver } from './auth.resolver'
import { commentResolver } from './comment.resolver'
import { configResolver } from './config.resolver'
import { dayResolver, dayTraineeResolver } from './day.resolver'
import { entryTraineeResolver } from './entry.resolver'
import { reportResolver, reportTraineeResolver } from './report.resolver'
import { traineeResolver, traineeTraineeResolver } from './trainee.resolver'
import { trainerResolver } from './trainer.resolver'
import { userResolver } from './user.resolver'
import { avatarResolver } from './avatar.resolver'

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

  userResolver,
  authResolver,

  adminResolver,
  traineeAdminResolver,
  trainerAdminResolver,

  alexaResolver,

  avatarResolver,
]
