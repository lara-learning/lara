import React, { JSX, useState } from 'react'

import {
  FaqLayout,
  Spacings,
  StyledFAQSearch,
  StyledFAQSearchWrapper,
  StyledFaqTitle,
  StyledIcon,
  StyledSupportExternalLink,
  StyledSupportLink,
} from '@lara/components'

import Accordion from '../components/accordion'
import strings from '../locales/localization'
import { Template } from '../templates/template'

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

export const FAQPage: React.FC = () => {
  const QAs = defaultQAs()

  const [filteredQAs, setFilteredQAs] = useState(QAs)

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const search = (event.target as HTMLInputElement).value.toLowerCase()

    const newFilteredQAs = QAs.filter(({ question: q, answer: a }) => {
      let aFilter = false

      if (typeof a === 'string') {
        aFilter = a.toLowerCase().includes(search)
      } else {
        // check all elements in the array
        aFilter = a.some((element) => {
          if (typeof element === 'string') {
            return element.toLowerCase().includes(search)
          }

          // the strings.formatString function actually returns an Array of Elements
          const elements = element as unknown as JSX.Element[]

          // check all props for a match with the search
          return elements.some((e) =>
            Object.values(e.props).some((p) => typeof p === 'string' && p.toLowerCase().includes(search))
          )
        })
      }

      return q.toLowerCase().includes(search) || aFilter
    })

    setFilteredQAs(newFilteredQAs)
  }

  return (
    <Template type="Main">
      <FaqLayout
        title={<StyledFaqTitle>FAQ</StyledFaqTitle>}
        search={
          <StyledFAQSearchWrapper>
            <StyledIcon name={'Search'} size={Spacings.xl} color={'lightFont'}></StyledIcon>
            <StyledFAQSearch onInput={handleSearch} placeholder="Search" />
          </StyledFAQSearchWrapper>
        }
      >
        <div>
          {filteredQAs.map(({ question: q, answer: a }, index) => (
            <Accordion forceActive={filteredQAs.length === 1} key={index} title={q}>
              {a}
            </Accordion>
          ))}
        </div>
      </FaqLayout>
    </Template>
  )
}
