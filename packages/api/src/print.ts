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

export type PrintPaper = {
  status: string
  briefing: PrintBriefing[]
  client: string
  periodStart: string
  periodEnd: string
  schoolPeriodStart: string
  schoolPeriodEnd: string
  subject: string
  //department: string
}

export type PrintBriefing = {
  question: string
  questionId: string
  hint: string
  answer: string
  id: string
}

export type PrintUserData = {
  firstName: string
  lastName: string
  receiverEmail: string
  course: string
  type?: string
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

export type PrintPaperData = {
  filename: string
  paper: PrintPaper
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
  client: string
  mentor: string
  trainer: string
  trainee: string
  briefing: string
}

export type PrintPayload = {
  printDataHash: string
}

export type PrintData = {
  userData: PrintUserData
  data: PrintReportData[] | PrintPaperData[]
  printTranslations: PrintTranslations
  emailTranslations: EmailTranslations
}
