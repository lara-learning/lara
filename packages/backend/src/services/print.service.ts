import { differenceInYears, endOfWeek, format, nextFriday } from 'date-fns'
import { GraphQLError } from 'graphql'
import hash from 'object-hash'

import {
  Day,
  Entry,
  PrintData,
  PrintDay,
  PrintEntry,
  PrintPayload,
  PrintReport,
  PrintReportData,
  PrintUserData,
  Report,
  Trainee,
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
 * Creates the user data that is needed by the print lambda
 * for generating the PDF
 * @param trainee Trainee for PDF
 * @returns Userdata
 */
export const createPrintUserData = async (trainee: Trainee): Promise<PrintUserData> => {
  const trainerSignature =
    trainee.trainerId && (await trainerById(trainee.trainerId).then((trainer) => trainer?.signature))

  return {
    receiverEmail: trainee.email,
    firstName: trainee.firstName,
    lastName: trainee.lastName,
    course: trainee.course ?? '',
    traineeSignature: trainee.signature && `data:image/svg+xml;base64,${trainee.signature}`,
    trainerSignature: trainerSignature && `data:image/svg+xml;base64,${trainerSignature}`,
  }
}

/**
 * Turns an entry from the DB into an entry for the print export
 * @param entry Entry to transform
 * @returns Entry for print
 */
const transformEntry = (entry: Entry): PrintEntry => ({
  text: entry.text ? entry.text : entry.text_split!,
  time: entry.time ? entry.time : entry.time_split!,
  orderId: entry.orderId,
})

/**
 * Turns an day from the DB into an day for the print export
 * @param day Day to transform
 * @returns Day for print
 */
const transformDay = (day: Day): PrintDay => ({
  status: dayStatus(day),
  status_split: day.status_split,
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
