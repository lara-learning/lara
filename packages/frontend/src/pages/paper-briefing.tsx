import React, {useEffect, useState} from 'react'

import {
  PaperLayout,
} from '@lara/components'

import strings from '../locales/localization'
import { Template } from '../templates/template'
import PaperAccordion from "../components/paper-accordion";
import {PrimaryButton} from "../components/button";
import {useParams} from "react-router";
import {
  PaperFormData,
  PaperStatus, Trainer,
  useTrainerPaperPageDataQuery, useUpdatePaperMutation
} from "../graphql";
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


export const PaperBriefing: React.FunctionComponent<PaperBriefingParams> = () => {
  const { paperId} = useParams<PaperBriefingParams>()
  const [paperBriefingInput, setPaperBriefingInput] = React.useState<PaperFormData>({
    answer: '',
    question: '',
    id: '',
    hint: '',
  })
  const [paperBriefing, setPaperBriefing] = React.useState<PaperFormData[]>([])

  const QAs = briefingQuestions()
  const [filteredQAs] = useState(QAs)

  const trainerPaperPageData = useTrainerPaperPageDataQuery()
  const [updatePaperMutation] = useUpdatePaperMutation()


  const currentUser = trainerPaperPageData?.data?.currentUser as Trainer

  const paper = currentUser?.papers?.find(paper => paper?.id == paperId)
  useEffect(() => {
    setPaperBriefing((oldArray: PaperFormData[]) => [...oldArray, paperBriefingInput])
    console.log(paperBriefing)
  },[paperBriefingInput])

  if (!currentUser) {
    return null
  }

  const updatePaper = async (paperBriefing: PaperFormData[]) => {
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
    })
}
  // const statusChange = (status: EntryStatusType) => handleStatusChange && handleStatusChange(status)

  /*const handleSave = (newPaperInput: AnswerPaperInput) => {
    if (newPaperInput.answer === paperInput.answer) {
      return
    }

    statusChange(StatusTypes.loading)
  }*/

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
        <PrimaryButton type="submit" onClick={() =>updatePaper(paperBriefing)}>
          {strings.continue}
        </PrimaryButton>
      </PaperLayout>
    </Template>
  )
}
