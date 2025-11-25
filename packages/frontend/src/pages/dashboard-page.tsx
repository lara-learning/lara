import { getDay, getISOWeek, getYear, isWeekend } from 'date-fns'
import React from 'react'

import { Container, H1, Paragraph, StyledDashboardWeeks, Flex, Box } from '@lara/components'

import DayInput from '../components/day-input'
import Illustrations from '../components/illustration'
import Loader from '../components/loader'
import WeekOverview from '../components/week-overview'
import { DashboardPageDataQueryVariables, DayStatusEnum, ReportStatus, useDashboardPageDataQuery } from '../graphql'
import DateHelper from '../helper/date-helper'
import { useIsDarkMode } from '../hooks/use-is-dark-mode'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { useReportHelper } from '../helper/report-helper'

const DashboardPage: React.FunctionComponent = () => {
  const variables: DashboardPageDataQueryVariables = {
    currentYear: getYear(Date.now()),
    currentWeek: getISOWeek(Date.now()),
  }

  const { getFinishedDays } = useReportHelper()

  const { data, loading } = useDashboardPageDataQuery({ variables })

  const isDarkMode = useIsDarkMode(data?.currentUser)

  /**
   * Returns the title for the current day, which is either a weekday or weekend
   */
  const getTodayHeading = (): string => {
    if (!data?.reportForYearAndWeek) {
      return strings.dashboard.success
    }

    const isTodayWeekend = isWeekend(Date.now())
    if (isTodayWeekend) {
      return strings.dashboard.weekend
    }
    return `${strings.today}, ${DateHelper.format(Date.now(), 'd. MMMM yyyy')}`
  }

  const reportForYearAndWeek = data?.reportForYearAndWeek

  const day = reportForYearAndWeek && reportForYearAndWeek.days[getDay(Date.now()) - 1]

  const relevantReports = data?.reports.filter((report) => report?.status !== ReportStatus.Archived)

  const hasReports = relevantReports && relevantReports.length > 0

  const showDayInput =
    reportForYearAndWeek?.status === ReportStatus.Reopened || reportForYearAndWeek?.status === ReportStatus.Todo

  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading && hasReports && (
        /*  User has reports */
        <>
          {showDayInput && (
            <Container overflow={'visible'}>
              {day && (
                <DayInput
                  primary
                  term=""
                  heading={getTodayHeading()}
                  reportStatus={reportForYearAndWeek?.status}
                  day={day}
                  disabled={day?.status === DayStatusEnum.Holiday}
                />
              )}
            </Container>
          )}
          <StyledDashboardWeeks>
            {relevantReports?.map(
              (report) =>
                report && (
                  <WeekOverview
                    key={report.id}
                    report={report}
                    finishedDays={getFinishedDays(report)}
                    linkTo={`/report/${report.year}/${report.week}`}
                  />
                )
            )}
          </StyledDashboardWeeks>
        </>
      )}

      {/* User has no reports */}
      {!loading && !hasReports && (
        <Flex width={1} alignItems="center" flexDirection="column">
          <Box>
            <H1 center>{strings.dashboard.noReport.headline}</H1>
            <Paragraph center>{strings.dashboard.noReport.description}</Paragraph>
          </Box>
          <Box>
            <Illustrations.EmptyStateHappy darkMode={isDarkMode} />
          </Box>
        </Flex>
      )}
    </Template>
  )
}

export default DashboardPage
