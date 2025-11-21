import React, { useEffect, useState } from 'react'

import { H2, PaperLayout, Paragraph, Spacer } from '@lara/components'

import strings from '../locales/localization'
import { Template } from '../templates/template'
import PaperAccordion from '../components/paper-accordion'
import { PrimaryButton, SecondaryButton } from '../components/button'
import { useNavigate, useParams } from 'react-router'
import { PaperFormData, PaperStatus, Trainer, useTrainerPaperPageDataQuery, useUpdatePaperMutation } from '../graphql'
import Modal from '../components/modal'
import { Box, Flex } from '@lara/components'
import PaperModal from '../assets/illustrations/paper-modal-illustraion'
import { useFetchPaperPdf } from '../hooks/use-fetch-pdf'
import { useToastContext } from '../hooks/use-toast-context'
import { omitDeep } from '@apollo/client/utilities'
import NavigationButtonLink from '../components/navigation-button-link'
import { Question } from '../helper/paper-helper'

const briefingQuestions = (): Question[] => {
  const questions = strings.paper.briefingQuestions

  return [
    questions.objectOfTheWork,
    questions.procedure,
    questions.learningContent,
    questions.frameworkPlan,
    questions.tasksAndDutiesTrainee,
    questions.tasksAndDutiesMentor,
    questions.primeBlueAntMyTe,
    questions.feedback,
    questions.otherRemarks,
  ]
}

export const PaperBriefingPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { paperId } = useParams()
  const [paperBriefingInput, setPaperBriefingInput] = React.useState<PaperFormData>()
  const [paperBriefing, setPaperBriefing] = React.useState<PaperFormData[]>([])
  const [fetchPdf, loading] = useFetchPaperPdf()

  const QAs = briefingQuestions()
  const [filteredQAs] = useState(QAs)
  const [showHandoverModal, setShowHandoverModal] = React.useState(false)
  const [showBackToPaperModal, setShowBackToPaperModal] = React.useState(false)
  const [filledFromSave, setFilledFromSave] = React.useState(false)

  const toggleHandoverModal = () => setShowHandoverModal(!showHandoverModal)
  const toggleBackToPaperModal = () => setShowBackToPaperModal(!showBackToPaperModal)
  const trainerPaperPageData = useTrainerPaperPageDataQuery()
  const [updatePaperMutation] = useUpdatePaperMutation()
  const { addToast } = useToastContext()

  const currentUser = trainerPaperPageData?.data?.currentUser as Trainer

  const paper = currentUser?.papers?.find((paper) => paper?.id == paperId)
  useEffect(() => {
    if (paperBriefingInput) {
      setPaperBriefing((oldArray: PaperFormData[]) => [...oldArray, paperBriefingInput])
    }
  }, [paperBriefingInput])

  useEffect(() => {
    if (!filledFromSave && paper && paper.briefing.length > 0 && paperBriefing.length == 0) {
      setPaperBriefing(paper.briefing)
      setFilledFromSave(true)
    }
  }, [filledFromSave, paper, paperBriefing])

  if (!currentUser) {
    return null
  }

  const savePaper = async (paperBriefing: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          briefing: omitDeep(paperBriefing, '__typename'),
          feedbackTrainee: paper ? omitDeep(paper.feedbackTrainee, '__typename') : [],
          feedbackMentor: paper ? omitDeep(paper.feedbackMentor, '__typename') : [],
          client: paper?.client ?? '',
          id: paperId ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          schoolPeriodEnd: paper?.schoolPeriodEnd,
          schoolPeriodStart: paper?.schoolPeriodStart,
          didSendEmail: false,
          status: PaperStatus.NotStarted,
          subject: paper?.subject ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: currentUser.id,
        },
      },
      updateQueries: {
        TrainerPaperPageData: (prevData, { mutationResult }) => {
          return {
            currentUser: {
              ...prevData,
              papers: mutationResult.data?.updatePaper,
            },
          }
        },
      },
    })
  }

  const submitPaper = async (paperBriefing: PaperFormData[]) => {
    await updatePaperMutation({
      variables: {
        input: {
          briefing: omitDeep(paperBriefing, '__typename'),
          feedbackTrainee: paper?.feedbackTrainee ?? [],
          feedbackMentor: paper?.feedbackMentor ?? [],
          client: paper?.client ?? '',
          id: paperId ?? '',
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          didSendEmail: false,
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
        TrainerPaperPageData: (prevData, { mutationResult }) => {
          return {
            currentUser: {
              ...prevData,
              papers: mutationResult.data?.updatePaper,
            },
          }
        },
      },
    })
      .then((result) => {
        const updatedPaper = result?.data?.updatePaper
        if (updatedPaper) {
          fetchPdf(updatedPaper)
        }
      })
      .finally(() => {
        addToast({
          icon: 'Export',
          title: strings.paper.briefing.toastTitle,
          text: strings.paper.briefing.toastDescription,
          type: 'success',
        })
        toggleBackToPaperModal()
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
        <div>
          {filteredQAs.map(({ question: q, hint: h }, index) => (
            <PaperAccordion
              setPaperFormInput={setPaperBriefingInput}
              setPaperForm={setPaperBriefing}
              completedInput={paperBriefing}
              paperInput={{
                id: Date.now().toString(),
                question: q,
                questionId: index.toString(),
                hint: h,
                answer: '',
                comments: [],
              }}
              forceActive={filteredQAs.length === 1}
              key={q}
              title={q}
              currentUser={currentUser}
            >
              {h}
            </PaperAccordion>
          ))}
        </div>
        <Flex width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
          <Box mr={'2'}>
            <SecondaryButton
              onClick={() => {
                savePaper(paperBriefing)
                navigate('/paper')
              }}
            >
              {strings.save}
            </SecondaryButton>
          </Box>
          <Box ml={'2'}>
            <PrimaryButton type="submit" onClick={toggleHandoverModal}>
              {strings.continue}
            </PrimaryButton>
          </Box>
        </Flex>
        <Modal show={showHandoverModal} customClose handleClose={toggleHandoverModal}>
          <Flex flexDirection={'row'} alignItems={'center'}>
            <Box width={1 / 3}>
              <PaperModal />
            </Box>
            <Box width={2 / 3}>
              <H2>{strings.paper.modal.title}</H2>
              <Paragraph>{strings.paper.modal.description}</Paragraph>
              <Flex my={'2'}>
                <Box pr={'2'} width={1 / 2}>
                  <SecondaryButton fullsize onClick={toggleHandoverModal} disabled={loading}>
                    {strings.cancel}
                  </SecondaryButton>
                </Box>
                <Box pl={'2'} width={1 / 2}>
                  <PrimaryButton fullsize onClick={() => submitPaper(paperBriefing)}>
                    {strings.paper.modal.createBriefing}
                  </PrimaryButton>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Modal>
        <Modal show={showBackToPaperModal} customClose handleClose={toggleBackToPaperModal}>
          <Flex flexDirection={'row'} alignItems={'center'}>
            <Box width={1 / 3}>
              <PaperModal />
            </Box>
            <Box width={2 / 3}>
              <H2>{strings.paper.modal.backToPaperTitle}</H2>
              <Paragraph>{strings.paper.modal.backToPaperDescription}</Paragraph>
              <Flex my={'2'} justifyContent={'end'}>
                <Box pl={'2'}>
                  <PrimaryButton
                    icon={loading ? 'Loader' : 'Blank'}
                    fullsize
                    disabled={loading}
                    onClick={() => navigate('/paper')}
                  >
                    {strings.paper.modal.backToPaperButton}
                  </PrimaryButton>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Modal>
      </PaperLayout>
    </Template>
  )
}
