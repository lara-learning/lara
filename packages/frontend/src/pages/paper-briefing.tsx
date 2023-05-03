import React, { useState } from 'react'

import {
  PaperLayout,
  StyledSupportExternalLink,
  StyledSupportLink,
} from '@lara/components'

import strings from '../locales/localization'
import { Template } from '../templates/template'
import PaperAccordion from "../components/paper-accordion";

type Question = { question: string; answer: string | (string | JSX.Element)[] }

const defaultQAs = (): Question[] => {
  const { questions } = strings.support

  return [
    questions.autoSave,
    questions.aboutUs,
    questions.exportEmail,
    questions.exportTime,
    questions.features,
    questions.handoverMistake,
    questions.name,
    questions.schoolReport,
    questions.signature,
    questions.timetable,
    {
      question: strings.support.questions.bug.question,
      answer: strings.formatString(
        strings.support.questions.bug.answer,
        <StyledSupportExternalLink href={`mailto:${ENVIRONMENT.supportMail}`} target="_blank">
          {ENVIRONMENT.supportMail}
        </StyledSupportExternalLink>
      ),
    },
    {
      question: questions.darkmode.question,
      answer: strings.formatString(
        strings.support.questions.darkmode.answer,
        <StyledSupportLink to="/settings">{questions.darkmode.link}</StyledSupportLink>
      ),
    },
  ]
}

export const PaperBriefing: React.FC = () => {
  const QAs = defaultQAs()
  const [filteredQAs] = useState(QAs)

  return (
    <Template type="Main">
      <PaperLayout>
        <div>
          {filteredQAs.map(({ question: q, answer: a }, index) => (
            <PaperAccordion paperInput={{id: index.toString(), question: q, answer:''}} forceActive={filteredQAs.length === 1} key={index} title={q}>
              {a}
            </PaperAccordion>
          ))}
        </div>
      </PaperLayout>
    </Template>
  )
}
