import { EmailTranslations } from '.'

export type PrintEntry = {
  orderId: number
  text: string
  time: number
}

export type PrintDayStatusEnum = 'work' | 'vacation' | 'sick' | 'education' | 'holiday'

export type PrintDay = {
  entries: PrintEntry[]
  status: PrintDayStatusEnum
}

export type PrintReport = {
  days: PrintDay[]
  department: string
  summary: string
}

export type PrintUserData = {
  firstName: string
  lastName: string
  receiverEmail: string
  course: string
  traineeSignature?: string
  trainerSignature?: string
}

export type PrintReportData = {
  filename: string
  apprenticeYear: number
  reportPeriod: string
  report: PrintReport
  signatureDate: string
}

export type PrintTranslations = {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  name: string
  apprenticeCourse: string
  department: string
  apprenticeYear: string
  period: string
  description: string
  duration: string
  holiday: string
  sick: string
  vacation: string
  total: string
  totalWeek: string
  date: string
  signatureTrainee: string
  signatureTrainer: string
  hello: string
}

export type PrintPayload = {
  printDataHash: string
}

export type PrintData = {
  userData: PrintUserData
  reportsData: PrintReportData[]
  printTranslations: PrintTranslations
  emailTranslations: EmailTranslations
}
