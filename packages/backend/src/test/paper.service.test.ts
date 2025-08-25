import { GqlPaper, GqlPaperInput } from '@lara/api'
import { generateTrainee } from '../services/trainee.service'
import { generatePaper } from '../services/paper.service'
import { generateMentor } from '../services/mentor.service'
import { generateTrainer } from '../services/trainer.service'

describe('createPaperData', () => {
  let paperInput: GqlPaperInput
  let paper: GqlPaper

  beforeAll(async () => {
    const trainee = await generateTrainee({
      firstName: 'Trainee',
      lastName: 'Traineeson',
      email: 'trainee@sinnerschrader.com',
      startDate: '2023-08-01T22:00:00.000Z',
      endDate: '2028-07-31T22:00:00.000Z',
    })
    const trainer = await generateTrainer({
      firstName: 'Trainer',
      lastName: 'Trainerson',
      email: 'trainer@sinnerschrader.com',
    })
    const mentor = await generateMentor({
      firstName: 'Men',
      lastName: 'Tor',
      email: 'mentor@sinnerschrader.com',
      startDate: '2023-08-01T22:00:00.000Z',
      endDate: '2028-07-31T22:00:00.000Z',
    })

    paperInput = {
      traineeId: trainee.id,
      trainerId: trainer.id,
      client: 'TestClient',
      mentorId: mentor.id,
      periodStart: '2022-08-07T05:14:28.000Z',
      periodEnd: '2025-08-07T05:14:28.000Z',
      subject: 'Test Subject',
      status: 'InProgress',
      briefing: [
        {
          id: '1',
          questionId: '1',
          answer: 'TestAnswer',
          question: 'TestQuestion',
          hint: 'TestHint',
        },
      ],
    }

    paper = generatePaper(paperInput)
  })

  it('returns correct paper status', () => {
    expect(paperInput.status).toBe(paper.status)
  })

  it('returns true when the paper has been created by checking if paperId has been created', () => {
    expect(paper.id).toBeTruthy()
  })

  it('check if mentor has been assigned correctly', () => {
    expect(paperInput.mentorId).toBe(paper.mentorId)
  })
})
