import { PaperStatus } from '../graphql'

export type Question = { question: string; hint: string }

export const mapStatusToProgess = (status: PaperStatus): number => {
  switch (status) {
    case 'Archived':
      return 1
    case 'InProgress':
      return 0.2
    case 'InReview':
      return 0.7
    case 'MentorDone':
      return 0.4
    case 'NotStarted':
      return 0
    case 'ReviewDone':
      return 0.9
    case 'TraineeDone':
      return 0.4
    default:
      return 0
  }
}

export const isPaperFeatureEnabled = (): boolean => {
  return ENVIRONMENT.nodeEnv === 'development' || ENVIRONMENT.nodeEnv === 'staging'
}
