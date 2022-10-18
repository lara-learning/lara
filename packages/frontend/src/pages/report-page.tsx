import { GraphQLError } from 'graphql'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { Container, H2, Paragraph, Spacer, StyledTopBorderWrapper } from '@lara/components'
import { Box, Flex } from '@rebass/grid'

import { PrimaryButton, SecondaryButton } from '../components/button'
import DayInput from '../components/day-input'
import Loader from '../components/loader'
import Modal from '../components/modal'
import ReportPageFooter from '../components/report-page-footer'
import ReportPageHeader from '../components/report-page-header'
import { EntryOrderProvider } from '../context/entry-order'
import {
  DayStatusEnum,
  Report,
  ReportPageDataQueryVariables,
  ReportStatus,
  useReportPageDataQuery,
  useUpdateReportMutation,
} from '../graphql'
import { useFetchPdf } from '../hooks/use-fetch-pdf'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { useReportHelper } from '../helper/report-helper'

interface ReportPageParams {
  year: string
  week: string
}

const ReportPage: React.FunctionComponent<RouteComponentProps<ReportPageParams>> = (props) => {
  const { getFinishedDays } = useReportHelper()

  const variables: ReportPageDataQueryVariables = {
    year: parseInt(props.match.params.year, 10),
    week: parseInt(props.match.params.week, 10),
  }

  const { loading, data } = useReportPageDataQuery({ variables })
  const report = data?.reportForYearAndWeek
  const currentUser = data?.currentUser

  const [updateReportMutation] = useUpdateReportMutation()
  const { addToast } = useToastContext()

  const [fetchPdf, pdfLoading] = useFetchPdf()

  const [showHandoverModal, setShowHandoverModal] = React.useState(false)
  const [showUnarchiveModal, setShowUnarchiveModal] = React.useState(false)

  const toggleHandoverModal = () => setShowHandoverModal(!showHandoverModal)
  const toggleUnarchiveModal = () => setShowUnarchiveModal(!showUnarchiveModal)

  const updateReport = async (values: Partial<Report>) => {
    if (!report) return

    return updateReportMutation({
      variables: {
        ...report,
        ...values,
      },
    })
      .then(() => {
        if (values.department) {
          addToast({
            icon: 'Department',
            title: strings.report.department.departmentAddedTitle,
            text: strings.report.department.departmentAddedText,
            type: 'success',
          })
        } else if (values.status === ReportStatus.Review) {
          addToast({
            icon: 'Report',
            title: strings.report.handoverTitle,
            text: strings.report.handoverNotificationText,
            type: 'success',
          })
        } else if (values.status === ReportStatus.Reopened) {
          addToast({
            icon: 'Report',
            title: strings.trainerReportOverview.reportDeclinedSuccessTitle,
            text: strings.trainerReportOverview.reportDeclinedSuccess,
            type: 'success',
          })
        } else if (values.status === ReportStatus.Archived) {
          addToast({
            icon: 'Archive',
            title: strings.trainerReportOverview.reportToArchiveSuccessTitle,
            text: strings.trainerReportOverview.reportToArchiveSuccess,
            type: 'success',
          })
        }
      })
      .catch((error: GraphQLError) => {
        addToast({ title: strings.errors.error, text: error.message, type: 'error' })
      })
  }

  const handoverReport = () => {
    void updateReport({ status: ReportStatus.Review })
    props.history.push('/')
  }

  const unarchiveReport = () => {
    void updateReport({ status: ReportStatus.Reopened })
    props.history.push('/')
  }

  const { match } = props
  const { params } = match
  const { week } = params

  const finishedDays = report && getFinishedDays(report)

  const reportArchived = report?.status === ReportStatus.Archived
  const reportReview = report?.status === ReportStatus.Review
  const reportReopened = report?.status === ReportStatus.Reopened
  const reportTodo = report?.status === ReportStatus.Todo

  const renderReportPageBody = () => {
    if (!report || !currentUser || currentUser.__typename !== 'Trainee') return

    return (
      <Container overflow="visible">
        <ReportPageHeader report={report} currentUser={currentUser} updateReport={updateReport} />

        <EntryOrderProvider>
          {report.days.map((day) => (
            <StyledTopBorderWrapper key={day.id}>
              <DayInput
                day={day}
                disabled={reportArchived || reportReview || day.status === DayStatusEnum.Holiday}
                reportStatus={report.status}
              />
            </StyledTopBorderWrapper>
          ))}
        </EntryOrderProvider>

        {data.currentUser && (
          <ReportPageFooter
            report={report}
            disabled={reportArchived || reportReview}
            user={data.currentUser}
            updateReport={updateReport}
          />
        )}
      </Container>
    )
  }

  const renderReportPageButtons = () => {
    if (!report) return

    return (
      <Spacer y="l">
        <Flex justifyContent={'flex-end'} alignItems={'center'}>
          {(reportTodo || reportReopened) && (
            <PrimaryButton disabled={finishedDays !== 5 || !report.department} onClick={toggleHandoverModal}>
              {strings.report.handover}
            </PrimaryButton>
          )}
          {reportArchived && (
            <>
              <Spacer right="m">
                <SecondaryButton onClick={toggleUnarchiveModal}>{strings.report.unarchive}</SecondaryButton>
              </Spacer>
              <PrimaryButton disabled={pdfLoading} onClick={() => fetchPdf([report])}>
                {strings.report.export}
              </PrimaryButton>
            </>
          )}
        </Flex>
      </Spacer>
    )
  }

  return (
    <Template type="Main">
      {(loading || !data) && <Loader />}

      {!loading && !data?.reportForYearAndWeek && <Redirect to="/report/missing" />}

      {!loading && (
        <>
          {renderReportPageBody()}

          {renderReportPageButtons()}

          <Modal show={showHandoverModal} customClose handleClose={toggleHandoverModal}>
            <H2>{strings.formatString(strings.report.modalTitle.handover, strings.weekOverview.week, week)}</H2>
            <Paragraph>{strings.report.modalCopy.handover}</Paragraph>
            <Flex my={'2'}>
              <Box pr={'2'} width={1 / 2}>
                <SecondaryButton fullsize onClick={toggleHandoverModal}>
                  {strings.cancel}
                </SecondaryButton>
              </Box>
              <Box pl={'2'} width={1 / 2}>
                <PrimaryButton fullsize onClick={handoverReport}>
                  {strings.report.handover}
                </PrimaryButton>
              </Box>
            </Flex>
          </Modal>

          <Modal show={showUnarchiveModal} customClose handleClose={toggleUnarchiveModal}>
            <H2>{strings.formatString(strings.report.modalTitle.unarchive, strings.weekOverview.week, week)}</H2>
            <Paragraph>{strings.report.modalCopy.unarchive}</Paragraph>
            <Flex my={'2'}>
              <Box pr={'2'} width={1 / 2}>
                <SecondaryButton fullsize onClick={toggleUnarchiveModal}>
                  {strings.cancel}
                </SecondaryButton>
              </Box>
              <Box pl={'2'} width={1 / 2}>
                <PrimaryButton fullsize onClick={unarchiveReport}>
                  {strings.report.unarchive}
                </PrimaryButton>
              </Box>
            </Flex>
          </Modal>
        </>
      )}
    </Template>
  )
}

export default ReportPage
