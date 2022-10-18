import React from 'react'

import {
  Container,
  StyledOverviewText,
  StyledWeek,
  StyledWeekLabel,
  StyledWeekLink,
  DefaultTheme,
} from '@lara/components'

import DateHelper from '../helper/date-helper'
import strings from '../locales/localization'
import ProgressBar from './progress-bar'
import { Report, ReportStatus } from '../graphql'
import { useReportHelper } from '../helper/report-helper'

interface WeekOverviewProps {
  report: Pick<Report, 'year' | 'week' | 'status'>
  finishedDays?: number
  linkTo?: string
}

const DAYS_TO_FINISH = 5
const DATE_FORMAT = 'dd.MM.'

const WeekOverview: React.FunctionComponent<WeekOverviewProps> = ({ report, linkTo, finishedDays }) => {
  const { getStatusColor } = useReportHelper()

  const { year, week, status } = report

  const startDate = DateHelper.startOfWeek(year, week)
  const endDate = DateHelper.endOfWeek(year, week)
  const from = DateHelper.format(startDate, DATE_FORMAT)
  const to = DateHelper.format(endDate, DATE_FORMAT)

  const inReview = status === ReportStatus.Review
  const inTodo = status === ReportStatus.Todo
  const reopened = status === ReportStatus.Reopened

  let progress = 1
  let progressColor: keyof DefaultTheme = 'successGreen'

  if (finishedDays !== undefined) {
    progress = finishedDays / DAYS_TO_FINISH
    progressColor = inTodo && finishedDays === DAYS_TO_FINISH ? 'successGreen' : getStatusColor(report.status)
  }

  let statusText = `${finishedDays}/${DAYS_TO_FINISH} ${strings.weekOverview.finishedDays}`

  if (inReview) {
    statusText = strings.report.underReview
  } else if (reopened) {
    statusText = strings.weekOverview.commented
  }

  const overview = (
    <Container paddingX="m" paddingY="s" hoverable={true} style={{ textDecoration: 'none' }}>
      <StyledOverviewText>
        {from} - {to}
      </StyledOverviewText>
      <StyledWeekLabel>{strings.weekOverview.week}</StyledWeekLabel>
      <StyledWeek>{week}</StyledWeek>
      <StyledOverviewText>{statusText}</StyledOverviewText>
      <ProgressBar progress={progress} color={progressColor} />
    </Container>
  )

  return linkTo ? <StyledWeekLink to={linkTo}>{overview}</StyledWeekLink> : overview
}

export default WeekOverview
