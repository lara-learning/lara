import { GqlTimetable, Report } from '@lara/api'
import { generateReport } from '../services/report.service'
import { generateTrainee } from '../services/trainee.service'
import { generateTimetable, fillReportWithTimetable } from '../services/timetable.service'

describe('fillReportsWithTimetable', () => {
  let filledReport: Report
  let timetableInput: GqlTimetable

  beforeAll(async () => {
    const trainee = await generateTrainee({
      firstName: 'Trainee',
      lastName: 'Traineeson',
      email: 'trainee@sinnerschrader.com',
      startDate: '2019-08-01T22:00:00.000Z',
      endDate: '2023-07-31T22:00:00.000Z',
    })
    timetableInput = {
      id: '1234',
      traineeId: trainee.id,
      title: 'Test Timetable',
      dateStart: '2019-08-01',
      dateEnd: '2020-07-31',
      entries: [
        {
          id: '123',
          day: 'monday',
          subject: 'Anwendungsentwicklung',
          timeStart: 7,
          timeEnd: 10,
          room: '106',
          notes: 'Timetable notes',
          teacher: 'Mr Peterson',
        },
      ],
    }

    const report = generateReport(2019, 32, trainee.id)
    const timetable = generateTimetable(timetableInput)

    filledReport = fillReportWithTimetable(report, timetable)
  })

  it('returns correct timetable subject', () => {
    expect(filledReport.days[0].entries[0].text).toBe(timetableInput.entries[0].subject)
  })

  it('returns correct timetable time', () => {
    expect(filledReport.days[0].entries[0].time / 60).toBe(
      timetableInput.entries[0].timeEnd - timetableInput.entries[0].timeStart
    )
  })
  it('returns correct timetable status', () => {
    expect(filledReport.days[0].status).toBe('education')
  })
})
