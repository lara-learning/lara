import { PrintReportData } from '@lara/api'
import { createPrintReportData } from '../services/print.service'
import { generateReport } from '../services/report.service'
import { generateTrainee } from '../services/trainee.service'

describe('createPrintReportData', () => {
  let printReportData: PrintReportData
  const department = 'lara-workshop'

  beforeAll(async () => {
    const trainee = await generateTrainee({
      firstName: 'Trainee',
      lastName: 'Traineeson',
      email: 'trainee@exampleCompany.com',
      startDate: '2022-08-01T22:00:00.000Z',
      endDate: '2027-07-31T22:00:00.000Z',
    })

    const report = generateReport(2022, 32, trainee.id)
    report.department = department

    printReportData = createPrintReportData(report, trainee)
  })

  it('returns correct apprenticeYear', () => {
    expect(printReportData.apprenticeYear).toBe(1)
  })

  it('returns correct report department', () => {
    expect(printReportData.report.department).toEqual(department)
  })
})
