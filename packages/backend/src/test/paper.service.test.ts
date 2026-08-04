import { GqlPaper, GqlPaperInput, GqlPaperUpdateInput } from '@lara/api'
import { generateTrainee } from '../services/trainee.service'
import { generatePaper, hasPaperCommentsIncreased } from '../services/paper.service'
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
          comments: [],
        },
      ],
      feedbackTrainee: [],
      feedbackMentor: [],
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

describe('hasPaperCommentsIncreased', () => {
  const basePaper: GqlPaper = {
    id: 'paper-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    traineeId: '123',
    trainerId: '456',
    client: 'TestClient',
    mentorId: '789',
    subject: 'Test Subject',
    status: 'TraineeDone',
    briefing: [],
    feedbackTrainee: [
      {
        id: '1',
        questionId: '1',
        question: 'Test question',
        comments: [{ text: 'Existing comment', userId: '456', published: true, firstName: 'Trainer', lastName: 'One' }],
      },
    ],
    feedbackMentor: [],
  }

  it('returns false when comments are unchanged', () => {
    const input: GqlPaperUpdateInput = {
      ...basePaper,
    }

    expect(hasPaperCommentsIncreased(basePaper, input)).toBe(false)
  })

  it('returns true when a new comment is added', () => {
    const input: GqlPaperUpdateInput = {
      ...basePaper,
      feedbackTrainee: [
        {
          ...basePaper.feedbackTrainee[0],
          comments: [
            ...basePaper.feedbackTrainee[0].comments,
            { text: 'New comment', userId: '456', published: true, firstName: 'Trainer', lastName: 'One' },
          ],
        },
      ],
    }

    expect(hasPaperCommentsIncreased(basePaper, input)).toBe(true)
  })
})
