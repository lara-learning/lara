import { differenceInYears, endOfWeek, format, nextFriday } from 'date-fns'
import { GraphQLError } from 'graphql'
import hash from 'object-hash'

import {
  Day,
  Entry,
  Paper,
  PaperFormData,
  PrintBriefing,
  PrintData,
  PrintDay,
  PrintEntry,
  PrintPaper,
  PrintPaperData,
  PrintPayload,
  PrintReport,
  PrintReportData,
  PrintUserData,
  Report,
  Trainee,
  User,
} from '@lara/api'

import { invokeLambda } from '../aws/lambda'
import { saveExport } from '../aws/s3'
import { trainerById } from '../repositories/trainer.repo'
import { parseISODateString } from '../utils/date'
import { dayStatus } from './day.service'
import { reportDate } from './report.service'
import { t } from '../i18n'

/**
 * Creates PDF name for a print export
 * @param report Report for PDF
 * @param trainee Trainee for PDF
 * @returns String of the PDF name
 */
export const createPDFName = (report: Report, trainee: Trainee): string => {
  return `${report.year}_KW${report.week}_Berichtsheft_${trainee.firstName}${trainee.lastName}.pdf`
}

/**
 * Creates PDF name for a print export
 * @returns String of the PDF name
 * @param paper
 */
export const createPaperPDFName = (paper: Paper): string => {
  return `Paper_Briefing_${paper.id}.pdf`
}

/**
 * Creates the user data that is needed by the print lambda
 * for generating the PDF
 * @param user Trainee for PDF
 * @returns Userdata
 */
export const createPrintUserData = async (user: User): Promise<PrintUserData> => {
  const trainerSignature =
    user.__typename == 'Trainee' &&
    user.trainerId &&
    (await trainerById(user.trainerId).then((trainer) => trainer?.signature))

  return {
    receiverEmail: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    type: user.__typename,
    course: user.__typename == 'Trainee' && user.course ? user.course : '',
    traineeSignature:
      user.__typename == 'Trainee' ? user.signature && `data:image/svg+xml;base64,${user.signature}` : '',
    trainerSignature:
      user.__typename == 'Trainee' && trainerSignature ? `data:image/svg+xml;base64,${trainerSignature}` : '',
  }
}

/**
 * Turns an entry from the DB into an entry for the print export
 * @param entry Entry to transform
 * @returns Entry for print
 */
const transformEntry = (entry: Entry): PrintEntry => ({
  text: entry.text,
  time: entry.time,
  orderId: entry.orderId,
})

/**
 * Turns an day from the DB into an day for the print export
 * @param day Day to transform
 * @returns Day for print
 */
const transformDay = (day: Day): PrintDay => ({
  status: dayStatus(day),
  entries: day.entries.map(transformEntry),
})

/**
 * Turns an report from the DB into an report for the print export
 * @param report Report to transform
 * @returns Report for print
 */
const transformReport = (report: Report): PrintReport => {
  return {
    summary: report.summary ?? '',
    department: report.department ?? '',
    days: report.days.map(transformDay),
  }
}

/**
 * Turns a paper from the DB into a paper for the print paper
 * @returns Paper for print
 * @param paperBriefing
 */
const transformPaperBriefing = (paperBriefing: PaperFormData[]): PrintBriefing[] => {
  const printBriefing: PrintBriefing[] = []
  paperBriefing.map((briefing: PaperFormData) => {
    printBriefing.push({
      question: briefing.question,
      questionId: briefing.questionId,
      hint: briefing.hint ?? '',
      answer: briefing.answer ?? '',
      id: briefing.id,
    })
  })
  return printBriefing
}

/**
 * Turns a paper from the DB into a paper for the print export
 * @returns Paper for print
 * @param paper
 */
const transformPaper = (paper: Paper): PrintPaper => {
  return {
    status: paper.status,
    briefing: transformPaperBriefing(paper.briefing),
    client: paper.client,
    periodStart: paper.periodStart ?? '',
    periodEnd: paper.periodEnd ?? '',
    schoolPeriodStart: paper.schoolPeriodStart ?? '',
    schoolPeriodEnd: paper.schoolPeriodEnd ?? '',
    subject: paper.subject,
  }
}

/**
 * Creates the report data that is needed by the print lambda
 * for generating the PDF
 * @param report Report for PDF
 * @param trainee Trainee for PDF
 * @returns Reportdata
 */
export const createPrintReportData = (report: Report, trainee: Trainee): PrintReportData => {
  if (!trainee.startDate) {
    throw new GraphQLError(t('errors.missingStartDate', trainee.language))
  }

  const reportStartOfWeek = reportDate(report)
  const reportEndOfWeek = endOfWeek(reportStartOfWeek)
  const { reportAccepted } = report

  return {
    report: transformReport(report),
    filename: createPDFName(report, trainee),
    apprenticeYear: differenceInYears(reportStartOfWeek, parseISODateString(trainee.startDate)) + 1,
    reportPeriod: `${format(reportStartOfWeek, 'dd.MM.yyyy')} - ${format(reportEndOfWeek, 'dd.MM.yyyy')}`,
    signatureDate: reportAccepted
      ? `${format(parseISODateString(reportAccepted), 'dd.MM.yyyy')}`
      : `${format(nextFriday(reportStartOfWeek), 'dd.MM.yyyy')}`,
  }
}

/**
 * Creates the paper data that is needed by the print lambda
 * for generating the PDF
 * @returns Paperdata
 * @param paper
 */
export const createPrintPaperData = (paper: Paper): PrintPaperData => {
  return {
    filename: createPaperPDFName(paper),
    paper: transformPaper(paper),
  }
}

export const savePrintData = async (printData: PrintData): Promise<string> => {
  const generatedKey = hash(printData) + '.json'

  await saveExport(generatedKey, JSON.stringify(printData))

  return generatedKey
}

/**
 * Calls the print lambda and doesn't wait for a response.
 * @param payload Print data
 */
export const invokePrintLambda = async (payload: PrintPayload): Promise<void> =>
  await invokeLambda({ payload, functionName: 'print' })
