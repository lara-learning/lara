import { PaperStatus } from '../graphql'

export type Question = { question: string; hint: string }

export const mapStatusToProgess = (status: PaperStatus): number => {
  switch (status) {
    case 'NotStarted':
      return 0
    case 'InProgress':
      return 0.3
    default:
      return 0
  }
}
