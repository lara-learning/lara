import { Box, Flex, PaperH2, PaperLayout, Spacer } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import { Template } from '../templates/template'
import strings from '../locales/localization'
import { Question } from '../helper/paper-helper'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PrimaryButton, SecondaryButton } from '../components/button'
import PaperAccordion from '../components/paper-accordion'
import React from 'react'
import { Mentor, PaperFormData, PaperStatus, useMentorPaperPageDataQuery, useUpdatePaperMutation } from '../graphql'
import { omitDeep } from '@apollo/client/utilities'

const mentorFeedbackQuestions = (): Question[] => {
  const q = strings.paper.mentorFeedbackQuestions
  return [q.integrationIntoTeam, q.communicationWithCustomers, q.willingnessToWork, q.abilities, q.goalAchieved]
}

export const MentorPaperFeedbackPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { paperId } = useParams()
  const [paperFeedbackInput, setPaperFeedbackInput] = React.useState<PaperFormData>()
  const [paperFeedback, setPaperFeedback] = React.useState<PaperFormData[]>([])
  const [filledFromSave, setFilledFromSave] = React.useState(false)

  const { data } = useMentorPaperPageDataQuery()
  const [updatePaperMutation] = useUpdatePaperMutation()

  const QAs = mentorFeedbackQuestions()
  const [filteredQAs] = useState(QAs)

  const currentUser = data?.currentUser as Mentor
  const paper = (currentUser?.papers || []).find((p) => p?.id == paperId)

  useEffect(() => {
    if (paperFeedbackInput) {
      setPaperFeedback((oldArray: PaperFormData[]) => [...oldArray, paperFeedbackInput])
    }
  }, [paperFeedbackInput])

  useEffect(() => {
    if (!filledFromSave && paper && paper.feedbackMentor.length > 0 && paperFeedback.length == 0) {
      setPaperFeedback(paper.feedbackMentor)
      setFilledFromSave(true)
    }
  }, [filledFromSave, paper, paperFeedback])

  if (!currentUser) return null

  const savePaper = async (feedback: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          id: paperId ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: paper?.trainerId ?? '',
          client: paper?.client ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          schoolPeriodEnd: paper?.schoolPeriodEnd,
          schoolPeriodStart: paper?.schoolPeriodStart,
          subject: paper?.subject ?? '',
          status: PaperStatus.TraineeDone,
          briefing: paper ? omitDeep(paper.briefing, '__typename') : [],
          didSendEmail: false,
          feedbackTrainee: paper?.feedbackTrainee
            ? omitDeep(paper.feedbackTrainee, '__typename').map((trainee) => ({
                ...trainee,
                comments: trainee.comments ? trainee.comments : [],
              }))
            : [],
          feedbackMentor: omitDeep(feedback, '__typename'),
        },
      },
      updateQueries: {
        MentorPaperPageData: ({ mutationResult }) => {
          return { currentUser: { papers: mutationResult?.data?.updatePaper } }
        },
      },
    })
  }

  const submitPaper = async (feedback: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          id: paperId ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: paper?.trainerId ?? '',
          client: paper?.client ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          schoolPeriodEnd: paper?.schoolPeriodEnd,
          schoolPeriodStart: paper?.schoolPeriodStart,
          subject: paper?.subject ?? '',
          status: PaperStatus.MentorDone,
          didSendEmail: false,
          briefing: paper ? omitDeep(paper.briefing, '__typename') : [],
          feedbackTrainee: paper?.feedbackTrainee
            ? omitDeep(paper.feedbackTrainee, '__typename').map((trainee) => ({
                ...trainee,
                comments: trainee.comments ? trainee.comments : [],
              }))
            : [],
          feedbackMentor: omitDeep(feedback, '__typename'),
        },
      },
      updateQueries: {
        MentorPaperPageData: ({ mutationResult }) => {
          return { currentUser: { papers: mutationResult?.data?.updatePaper } }
        },
      },
    })
  }

  return (
    <Template type="Main">
      <Spacer bottom="m">
        <NavigationButtonLink
          label={strings.back}
          to="/"
          icon="ChevronLeft"
          isLeft
          alignLeft
          iconColor="iconLightGrey"
        />
      </Spacer>
      <PaperLayout>
        <div style={{ width: '100%' }}>
          {filteredQAs.map(({ question: q, hint: h }, index) => (
            <div key={index}>
              {index.toString() === '1' && <PaperH2>{strings.paper.feedback.headlineEvaluationByMentor}</PaperH2>}
              <PaperAccordion
                setPaperFormInput={setPaperFeedbackInput}
                setPaperForm={setPaperFeedback}
                completedInput={paperFeedback}
                paperInput={{
                  id: Date.now().toString(),
                  question: q,
                  questionId: index.toString(),
                  hint: h,
                  answer: '',
                  comments: [],
                }}
                forceActive={filteredQAs.length === 1 || index.toString() === '0'}
                key={q}
                title={q}
                currentUser={currentUser}
              >
                {h}
              </PaperAccordion>
            </div>
          ))}
        </div>
      </PaperLayout>
      <Flex width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
        <Box mr={'2'}>
          <SecondaryButton
            onClick={() => {
              navigate('/')
              savePaper(paperFeedback)
            }}
          >
            {strings.save}
          </SecondaryButton>
        </Box>
        <Box ml={'2'}>
          <PrimaryButton
            type="submit"
            onClick={() => {
              navigate('/')
              submitPaper(paperFeedback)
            }}
          >
            {strings.done}
          </PrimaryButton>
        </Box>
      </Flex>
    </Template>
  )
}
