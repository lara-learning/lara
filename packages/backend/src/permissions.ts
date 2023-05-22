import { and, or, rule, shield } from 'graphql-shield'

import { Admin, AuthenticatedContext, Context, Mentor, Trainee, Trainer, User } from '@lara/api'

const { DEBUG } = process.env

const authenticated = rule({ cache: 'contextual' })(async (_parent, _args, ctx: Context) => Boolean(ctx.currentUser))

export const isTrainee = (user: User): user is Trainee => {
  return user.type === 'Trainee'
}

const trainee = rule({ cache: 'contextual' })(
  (_parent, _args, ctx: AuthenticatedContext) => isTrainee(ctx.currentUser) || 'Wrong Usertype'
)

export const isTrainer = (user: User): user is Trainer => {
  return user.type === 'Trainer'
}

const trainer = rule({ cache: 'contextual' })(
  (_parent, _args, ctx: AuthenticatedContext) => isTrainer(ctx.currentUser) || 'Wrong Usertype'
)

export const isMentor = (user: User): user is Mentor => {
  return user.type === 'Mentor'
}

export const isAdmin = (user: User): user is Admin => {
  return user.type === 'Admin'
}

const admin = rule({ cache: 'contextual' })(
  (_parent, _args, ctx: AuthenticatedContext) => isAdmin(ctx.currentUser) || 'Wrong Usertype'
)

export const isDebug = (): boolean => DEBUG === 'true'

const debug = rule({ cache: 'contextual' })(() => isDebug() || 'Wrong Env')

export const permissions = shield<unknown, Context>(
  {
    Query: {
      currentUser: authenticated,
      companies: authenticated,

      alexaLinkingUrl: authenticated,

      // Trainee queries
      reports: and(authenticated, trainee),
      suggestions: and(authenticated, trainee),
      reportForYearAndWeek: and(authenticated, trainee),
      print: and(authenticated, trainee),

      // Trainer queries
      reportForTrainee: and(authenticated, trainer),

      // Trainer and Admin Queries
      trainees: authenticated,

      // Admin Queris
      getUser: and(authenticated, admin),
      trainers: and(authenticated, admin),
      mentors: and(authenticated, admin),
    },
    Mutation: {
      _devsetusertype: and(authenticated, debug),
      _devloginuser: debug,

      updateCurrentUser: authenticated,

      linkAlexa: authenticated,
      unlinkAlexa: authenticated,
      createOAuthCode: authenticated,

      createMentor: and(authenticated, or(trainer, admin, trainee)),
      updateMentor: and(authenticated, or(trainer, admin, trainee)),

      // Trainee and Trainer mutations
      updateReport: and(authenticated, or(trainee, trainer)),
      createCommentOnEntry: and(authenticated, or(trainee, trainer)),
      createCommentOnDay: and(authenticated, or(trainee, trainer)),
      createCommentOnReport: and(authenticated, or(trainee, trainer)),

      // Trainee mutations
      createEntry: and(authenticated, trainee),
      deleteEntry: and(authenticated, trainee),
      updateEntry: and(authenticated, trainee),
      updateDay: and(authenticated, trainee),
      updateEntryOrder: and(authenticated, trainee),
      updateCurrentTrainee: and(authenticated, trainee),

      // Trainer mutations
      claimTrainee: and(authenticated, trainer),
      unclaimTrainee: and(authenticated, trainer),
      createPaper: and(authenticated, or(trainee, trainer)),
      updatePaper: and(authenticated, or(trainee, trainer)),
      deletePaper: and(authenticated, or(trainee, trainer)),

      //Admin mutations
      createTrainee: and(authenticated, admin),
      updateTrainee: and(authenticated, admin),
      createTrainer: and(authenticated, admin),
      updateTrainer: and(authenticated, admin),
      markUserForDeletion: and(authenticated, admin),
      unmarkUserForDeletion: and(authenticated, admin),
    },
  },
  { allowExternalErrors: true }
)
