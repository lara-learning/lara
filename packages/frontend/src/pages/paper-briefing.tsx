import React, {useEffect, useState} from 'react'

import {
  H2,
  PaperLayout, Paragraph,
} from '@lara/components'

import strings from '../locales/localization'
import { Template } from '../templates/template'
import PaperAccordion from "../components/paper-accordion";
import {PrimaryButton, SecondaryButton} from "../components/button";
import {RouteComponentProps, useParams} from "react-router";
import {
  PaperFormData,
  PaperStatus, Trainer,
  useTrainerPaperPageDataQuery, useUpdatePaperMutation
} from "../graphql";
import Modal from "../components/modal";
import {Box, Flex} from "@rebass/grid";
import PaperModal from "../assets/illustrations/paper-modal-illustraion";
interface PaperBriefingParams {
  paperId: string
}
type Question = { question: string; hint: string }

const briefingQuestions = (): Question[] => {
  const questions  = strings.paper.briefingQuestions

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


export const PaperBriefing: React.FunctionComponent<RouteComponentProps<PaperBriefingParams>> = ({ history }) => {
  const { paperId} = useParams<PaperBriefingParams>()
  const [paperBriefingInput, setPaperBriefingInput] = React.useState<PaperFormData>()
  const [paperBriefing, setPaperBriefing] = React.useState<PaperFormData[]>([])

  const QAs = briefingQuestions()
  const [filteredQAs] = useState(QAs)
  const [showHandoverModal, setShowHandoverModal] = React.useState(false)

  const toggleHandoverModal = () => setShowHandoverModal(!showHandoverModal)
  const trainerPaperPageData = useTrainerPaperPageDataQuery()
  const [updatePaperMutation] = useUpdatePaperMutation()


  const currentUser = trainerPaperPageData?.data?.currentUser as Trainer

  const paper = currentUser?.papers?.find(paper => paper?.id == paperId)
  useEffect(() => {
    if(paperBriefingInput) {
      setPaperBriefing((oldArray: PaperFormData[]) => [...oldArray, paperBriefingInput])
    }
  },[paperBriefingInput])

  if (!currentUser) {
    return null
  }

  const updatePaper = async (paperBriefing: PaperFormData[]) => {
    paperBriefing.sort(function(a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });
    await updatePaperMutation({
      variables: {
        input: {
          briefing: paperBriefing,
          client: paper?.client ?? '',
          id: paperId,
          mentorId: paper?.mentorId ?? '',
          periodEnd: paper?.periodEnd,
          periodStart: paper?.periodStart,
          status: PaperStatus.InProgress,
          subject: paper?.subject ?? '',
          traineeId: paper?.traineeId ?? '',
          trainerId: currentUser.id
        }
      },
    }).then(() => {
      history.push('/paper/')
    })
}

  return (
    <Template type="Main">
      <PaperLayout>
        <div>
          {filteredQAs.map(({ question: q, hint: h }, index) => (
            <PaperAccordion setPaperBriefing={setPaperBriefingInput} paperInput={{id: index.toString(), question: q, hint: h, answer:''}} forceActive={filteredQAs.length === 1} key={index} title={q}>
              {h}
            </PaperAccordion>
          ))}
        </div>
        <PrimaryButton type="submit" onClick={toggleHandoverModal}>
          {strings.continue}
        </PrimaryButton>
        <Modal show={showHandoverModal} customClose handleClose={toggleHandoverModal}>
          <Flex flexDirection={"column"}>
            <PaperModal/>
            <H2>{strings.paper.modal.title}</H2>
            <Paragraph>{strings.paper.modal.description}</Paragraph>
            <Flex my={'2'}>
              <Box pr={'2'} width={1 / 2}>
                <SecondaryButton fullsize onClick={toggleHandoverModal}>
                  {strings.cancel}
                </SecondaryButton>
              </Box>
              <Box pl={'2'} width={1 / 2}>
                <PrimaryButton fullsize onClick={() => updatePaper(paperBriefing)}>
                  {strings.paper.modal.createBriefing}
                </PrimaryButton>
              </Box>
            </Flex>
          </Flex>
        </Modal>
      </PaperLayout>
    </Template>
  )
}
