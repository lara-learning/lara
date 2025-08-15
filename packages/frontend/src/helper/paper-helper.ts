import { PaperStatus } from '../graphql'

export type Question = { question: string; hint: string }

export const mapStatusToProgess = (status: PaperStatus): number => {
  switch (status) {
    case 'NotStarted':
      return 0
    case 'InProgress':
      return 0.3
    case 'TraineeDone':
      return 0.6
    case 'MentorDone':
      return 0.6
    default:
      return 0
  }
}

export const isPaperFeatureEnabled = (): boolean => {
  return ENVIRONMENT.nodeEnv === 'development' || ENVIRONMENT.nodeEnv === 'staging'
}
