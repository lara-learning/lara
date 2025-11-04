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
import { PaperFormData, PaperStatus, Trainee, useTraineePaperPageDataQuery, useUpdatePaperMutation } from '../graphql'
import { omitDeep } from '@apollo/client/utilities'

const briefingQuestions = (): Question[] => {
  const questions = strings.paper.feedbackQuestions

  return [
    questions.descriptionOfActivities,
    questions.feedbackOnProjectTeam,
    questions.feedbackOnTasksAndProject,
    questions.periodOfTime,
    questions.learningContent,
  ]
}

export const TraineePaperFeedbackPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { paperId } = useParams()
  const [paperFeedbackInput, setPaperFeedbackInput] = React.useState<PaperFormData>()
  const [paperFeedback, setPaperFeedback] = React.useState<PaperFormData[]>([])
  const [filledFromSave, setFilledFromSave] = React.useState(false)

  const traineePaperPageData = useTraineePaperPageDataQuery()
  const [updatePaperMutation] = useUpdatePaperMutation()

  const QAs = briefingQuestions()
  const [filteredQAs] = useState(QAs)

  const currentUser = traineePaperPageData?.data?.currentUser as Trainee

  const paper = currentUser?.papers?.find((paper) => paper?.id == paperId)
  useEffect(() => {
    if (paperFeedbackInput) {
      setPaperFeedback((oldArray: PaperFormData[]) => [...oldArray, paperFeedbackInput])
    }
  }, [paperFeedbackInput])

  useEffect(() => {
    if (!filledFromSave && paper && paper.feedbackTrainee.length > 0 && paperFeedback.length == 0) {
      setPaperFeedback(paper.feedbackTrainee)
      setFilledFromSave(true)
    }
  }, [filledFromSave, paper, paperFeedback])

  if (!currentUser) {
    return null
  }

  console.log(paperFeedback)

  const savePaper = async (paperFeedback: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          briefing: paper ? omitDeep(paper.briefing, '__typename') : [],
          feedbackTrainee: omitDeep(paperFeedback, '__typename'),
          feedbackMentor: paper?.feedbackMentor ? omitDeep(paper.feedbackMentor, '__typename') : [],
          client: paper?.client ?? '',
          id: paperId ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          schoolPeriodEnd: paper?.schoolPeriodEnd,
          schoolPeriodStart: paper?.schoolPeriodStart,
          status: PaperStatus.InProgress,
          subject: paper?.subject ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: currentUser.id,
        },
      },
      updateQueries: {
        TraineePaperPageData: ({ mutationResult }) => {
          return {
            currentUser: {
              papers: mutationResult?.data?.updatePaper,
            },
          }
        },
      },
    })
  }

  const submitPaper = async (paperFeedback: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          briefing: paper ? omitDeep(paper.briefing, '__typename') : [],
          feedbackTrainee: omitDeep(paperFeedback, '__typename'),
          feedbackMentor: paper?.feedbackMentor ? omitDeep(paper.feedbackMentor, '__typename') : [],
          client: paper?.client ?? '',
          id: paperId ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          schoolPeriodEnd: paper?.schoolPeriodEnd,
          schoolPeriodStart: paper?.schoolPeriodStart,
          status: PaperStatus.TraineeDone,
          subject: paper?.subject ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: currentUser.id,
        },
      },
      updateQueries: {
        TraineePaperPageData: ({ mutationResult }) => {
          return {
            currentUser: {
              papers: mutationResult?.data?.updatePaper,
            },
          }
        },
      },
    })
  }

  return (
    <Template type="Main">
      <Spacer bottom="m">
        <NavigationButtonLink
          label={strings.back}
          to="/paper"
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
              {index.toString() === '1' && <PaperH2>{strings.paper.feedback.headlineEvaluationByTrainee}</PaperH2>}
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
              navigate('/paper')
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
              navigate('/paper')
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
