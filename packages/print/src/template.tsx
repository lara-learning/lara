import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { lightTheme, StyledPrintPaperEntry, StyledPrintPaperSubHeadline, ThemeProvider } from '@lara/components'

import { PrintUserData, PrintReport, PrintTranslations, PrintBriefing, PrintPaper } from '@lara/api'
import {
  Spacings,
  StyledPrintDay,
  StyledPrintDayHeader,
  StyledPrintHeadline,
  StyledPrintDayStatus,
  StyledPrintDaySubHeadline,
  StyledPrintEntry,
  StyledPrintEntryText,
  StyledPrintFooter,
  StyledPrintFooterTotalWrapper,
  StyledPrintHeader,
  StyledPrintSignatureContainer,
  StyledPrintUserInfo,
  StyledPrintUserInfoRow,
  StyledPrintUserInfoRowHeadline,
} from '@lara/components'

import { LaraLogo } from './components/lara-logo'
import { Signature } from './components/signature'
import { Total } from './components/total'
import { statusToString, weekdayMapping } from './utils/day'
import { entriesTotal, minutesToString } from './utils/time'

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Inter', sans-serif;
  }

  @page {
    size: auto;
    margin: ${Spacings.xxxl};
    padding: 0;
  }
`
const workDayMinutes = 480

type TemplateProps = {
  userData: PrintUserData
  i18n: PrintTranslations
  reportPeriod: string
  apprenticeYear: number
  report: PrintReport
  signatureDate: string
}
type PaperTemplateProps = {
  userData: PrintUserData
  i18n: PrintTranslations
  paper: PrintPaper
}

export const Template: React.FC<TemplateProps> = ({
  userData: { traineeSignature, trainerSignature, firstName, lastName, course },
  reportPeriod,
  apprenticeYear,
  report,
  i18n,
  signatureDate,
}) => {
  const totalTime = report.days.reduce(
    (acc, day) => acc + (day.status !== 'work' ? workDayMinutes : entriesTotal(day.entries)),
    0
  )
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <StyledPrintHeader>
        <LaraLogo />
      </StyledPrintHeader>
      <StyledPrintUserInfo>
        <StyledPrintUserInfoRow fullsize>
          <StyledPrintUserInfoRowHeadline> {i18n.name}: </StyledPrintUserInfoRowHeadline>
          {firstName} {lastName}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.apprenticeCourse}: </StyledPrintUserInfoRowHeadline>
          {course}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.apprenticeYear}: </StyledPrintUserInfoRowHeadline>
          {apprenticeYear}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.period}: </StyledPrintUserInfoRowHeadline>
          {reportPeriod}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.department}: </StyledPrintUserInfoRowHeadline>
          {report.department}
        </StyledPrintUserInfoRow>
      </StyledPrintUserInfo>
      <div>
        {report.days.map((day, dayIndex) => {
          const displayStatus = day.status === 'vacation' || day.status === 'sick' || day.status === 'holiday'
          return (
            <StyledPrintDay key={dayIndex}>
              <StyledPrintHeadline>{weekdayMapping(i18n)[dayIndex]}</StyledPrintHeadline>
              <StyledPrintDayHeader>
                <StyledPrintDaySubHeadline>{i18n.description}</StyledPrintDaySubHeadline>
                <StyledPrintDaySubHeadline>{i18n.duration}</StyledPrintDaySubHeadline>
              </StyledPrintDayHeader>

              {displayStatus ? (
                <StyledPrintEntry>
                  <StyledPrintDayStatus>{statusToString(day.status, i18n)}</StyledPrintDayStatus>
                  <StyledPrintEntryText>{'-'}</StyledPrintEntryText>
                </StyledPrintEntry>
              ) : (
                day.entries
                  .sort((a, b) => a.orderId - b.orderId)
                  .map((entry, entryIndex) => (
                    <StyledPrintEntry key={entryIndex}>
                      <StyledPrintEntryText>{entry.text}</StyledPrintEntryText>
                      <StyledPrintEntryText>{minutesToString(entry.time)}</StyledPrintEntryText>
                    </StyledPrintEntry>
                  ))
              )}

              <Total label={i18n.total} time={displayStatus ? workDayMinutes : entriesTotal(day.entries)} />
            </StyledPrintDay>
          )
        })}
      </div>
      <StyledPrintFooter>
        <StyledPrintFooterTotalWrapper>
          <Total label={i18n.totalWeek} time={totalTime} />
        </StyledPrintFooterTotalWrapper>
        <StyledPrintSignatureContainer>
          <Signature
            i18n={i18n}
            signatureDate={signatureDate}
            signature={traineeSignature}
            label={i18n.signatureTrainee}
          />
          <Signature
            i18n={i18n}
            signatureDate={signatureDate}
            signature={trainerSignature}
            label={i18n.signatureTrainer}
          />
        </StyledPrintSignatureContainer>
      </StyledPrintFooter>
    </ThemeProvider>
  )
}
export const PaperTemplate: React.FC<PaperTemplateProps> = ({
  userData: { firstName, lastName, course },
  paper,
  i18n,
}) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <StyledPrintHeader>
        <LaraLogo />
      </StyledPrintHeader>
      <StyledPrintUserInfo>
        <StyledPrintUserInfoRow fullsize>
          <StyledPrintUserInfoRowHeadline> {i18n.trainee}: </StyledPrintUserInfoRowHeadline>
          {firstName} {lastName}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.apprenticeCourse}: </StyledPrintUserInfoRowHeadline>
          {course}
        </StyledPrintUserInfoRow>
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.department}: </StyledPrintUserInfoRowHeadline>
          {paper.subject}
        </StyledPrintUserInfoRow>
        {paper.periodStart ? (
          <StyledPrintUserInfoRow>
            <StyledPrintUserInfoRowHeadline> {i18n.period}: </StyledPrintUserInfoRowHeadline>
            {paper.periodStart + ' -' + paper.periodEnd}
          </StyledPrintUserInfoRow>
        ) : null}
        <StyledPrintUserInfoRow>
          <StyledPrintUserInfoRowHeadline> {i18n.client}: </StyledPrintUserInfoRowHeadline>
          {paper.client}
        </StyledPrintUserInfoRow>
        {paper.schoolPeriodStart ? (
          <StyledPrintUserInfoRow>
            <StyledPrintUserInfoRowHeadline> {i18n.period}: </StyledPrintUserInfoRowHeadline>
            {paper.schoolPeriodStart + ' -' + paper.schoolPeriodEnd}
          </StyledPrintUserInfoRow>
        ) : null}
      </StyledPrintUserInfo>
      <div>
        {paper.briefing.map((briefing: PrintBriefing, index, array) => {
          return (
            <StyledPrintDay key={briefing.questionId}>
              {index == 0 || array[index].questionId !== array[index - 1].questionId ? (
                <>
                  <StyledPrintHeadline>{briefing.question}</StyledPrintHeadline>
                  <StyledPrintPaperSubHeadline>{briefing.hint}</StyledPrintPaperSubHeadline>
                </>
              ) : null}
              <StyledPrintPaperEntry>{briefing.answer}</StyledPrintPaperEntry>
            </StyledPrintDay>
          )
        })}
      </div>
    </ThemeProvider>
  )
}
