import React from 'react'

import { StyledIcon, TraineeOverviewLayout } from '@lara/components'

import { Report, ReportStatus, Trainee } from '../graphql'
import strings from '../locales/localization'
import Avatar from './avatar'
import WeekOverview from './week-overview'

interface TraineeReportsOverviweProps {
  trainee: Pick<Trainee, 'firstName' | 'lastName' | 'avatar' | 'id' | 'openReportsCount'> & {
    reports: Pick<Report, 'id' | 'status' | 'week' | 'year'>[]
  }
}

const TraineeReportsOverview: React.FunctionComponent<TraineeReportsOverviweProps> = ({ trainee }) => {
  const { upToDate, todo, todos } = strings.trainerReportOverview

  const { openReportsCount } = trainee
  const reportsInReview = trainee.reports.filter((report) => report.status === ReportStatus.Review)
  const caption = openReportsCount === 0 ? upToDate : openReportsCount > 1 ? todos : todo
  return (
    <TraineeOverviewLayout
      avatar={<Avatar size={44} image={trainee.avatar} />}
      name={`${trainee.firstName} ${trainee.lastName}`}
      icon={
        openReportsCount > 0 ? (
          <StyledIcon size="16px" color="errorRed" name={'Error'} />
        ) : (
          <StyledIcon size="16px" color="successGreen" name={'CheckCircle'} />
        )
      }
      caption={strings.formatString(caption, { count: openReportsCount }) as string}
    >
      {reportsInReview.map((report) => (
        <WeekOverview key={report.id} report={report} linkTo={`/reports/${trainee.id}/${report.year}/${report.week}`} />
      ))}
    </TraineeOverviewLayout>
  )
}

export default TraineeReportsOverview
