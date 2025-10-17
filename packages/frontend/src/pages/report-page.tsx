import { GraphQLError } from 'graphql'
import React from 'react'
import { Navigate, useParams, useNavigate } from 'react-router'

import { Container, H2, Paragraph, Spacer, StyledTopBorderWrapper, Flex, Box } from '@lara/components'

import { PrimaryButton, SecondaryButton } from '../components/button'
import DayInput from '../components/day-input'
import Loader from '../components/loader'
import Modal from '../components/modal'
import ReportPageFooter from '../components/report-page-footer'
import ReportPageHeader from '../components/report-page-header'
import { EntryOrderProvider } from '../context/entry-order'
import {
  Comment,
  Day,
  DayStatusEnum,
  Entry,
  Report,
  ReportPageDataQuery,
  ReportPageDataQueryVariables,
  ReportReviewPageDataQuery,
  ReportReviewPageDataQueryVariables,
  ReportStatus,
  Trainee,
  useDeleteCommentOnDayMutation,
  useDeleteCommentOnEntryMutation,
  useDeleteCommentOnReportMutation,
  usePublishAllCommentsMutation,
  useReportPageDataQuery,
  UserInterface,
  useUpdateCommentOnDayMutation,
  useUpdateCommentOnEntryMutation,
  useUpdateCommentOnReportMutation,
  useReportReviewPageDataQuery,
  useUpdateReportMutation,
  useUserPageQuery,
} from '../graphql'
import { useFetchPdf } from '../hooks/use-fetch-pdf'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { useReportHelper } from '../helper/report-helper'

const ReportPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { getFinishedDays } = useReportHelper()
  const { trainee, year, week, term } = useParams()

  const variables: ReportPageDataQueryVariables = {
    year: parseInt(year ?? '', 10),
    week: parseInt(week ?? '', 10),
  }

  const variables_trainer: ReportReviewPageDataQueryVariables = {
    year: parseInt(year ?? '', 10),
    week: parseInt(week ?? '', 10),
    trainee: trainee ?? '',
  }

  const reviewQuery = useReportReviewPageDataQuery({
    variables: variables_trainer,
    skip: !trainee,
  })

  const reportQuery = useReportPageDataQuery({
    variables,
    skip: !!trainee,
  })

  const userQuery = useUserPageQuery({
    variables: { id: trainee ?? '' },
    skip: !trainee,
  })

  const { loading, data } = trainee ? reviewQuery : reportQuery

  const report = trainee
    ? (data as ReportReviewPageDataQuery | undefined)?.reportForTrainee
    : (data as ReportPageDataQuery | undefined)?.reportForYearAndWeek

  const currentUser = trainee ? (userQuery.data?.getUser as Trainee) : data?.currentUser

  const [updateReportMutation] = useUpdateReportMutation()
  const { addToast } = useToastContext()
  const [fetchPdf, pdfLoading] = useFetchPdf()

  const [updateCommentOnReportMutation] = useUpdateCommentOnReportMutation()
  const [updateCommentOnDayMutation] = useUpdateCommentOnDayMutation()
  const [updateCommentOnEntryMutation] = useUpdateCommentOnEntryMutation()

  const [deleteCommentOnReportMutation] = useDeleteCommentOnReportMutation()
  const [deleteCommentOnDayMutation] = useDeleteCommentOnDayMutation()
  const [deleteCommentOnEntryMutation] = useDeleteCommentOnEntryMutation()

  const [publishAllCommentsMutation] = usePublishAllCommentsMutation()
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

  function updateReportComment(text: string, commentId: string) {
    if (!data) {
      return
    }

    const { currentUser } = data
    if (!report || !currentUser || currentUser.__typename !== 'Trainee') {
      return
    }
    if (text !== '') {
      void updateCommentOnReportMutation({
        variables: {
          id: report.id,
          text,
          traineeId: currentUser.id,
          commentId,
        },
      })
    } else {
      void deleteCommentOnReportMutation({
        variables: {
          id: report.id,
          traineeId: currentUser.id,
          commentId,
        },
      })
    }
  }

  function updateDayComment(
    day: Pick<Day, 'id'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    },
    text: string,
    commentId: string
  ) {
    if (!data) {
      return
    }

    const { currentUser } = data
    if (!currentUser || currentUser.__typename !== 'Trainee') {
      return
    }
    if (text !== '') {
      void updateCommentOnDayMutation({
        variables: {
          id: day.id,
          text,
          traineeId: currentUser.id,
          commentId,
        },
      })
    } else {
      void deleteCommentOnDayMutation({
        variables: {
          id: day.id,
          traineeId: currentUser.id,
          commentId,
        },
      })
    }
  }

  function updateEntryComment(
    entry: Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    },
    text: string,
    commentId: string
  ) {
    if (!data) {
      return
    }

    const { currentUser } = data
    if (!currentUser || currentUser.__typename !== 'Trainee') {
      return
    }
    if (text !== '') {
      void updateCommentOnEntryMutation({
        variables: {
          id: entry.id,
          text,
          traineeId: currentUser.id,
          commentId,
        },
      })
    } else {
      void deleteCommentOnEntryMutation({
        variables: {
          id: entry.id,
          traineeId: currentUser.id,
          commentId,
        },
      })
    }
  }

  const handoverReport = () => {
    void updateReport({ status: ReportStatus.Review }).then(() => {
      if (!report || !currentUser) return
      publishAllCommentsMutation({ variables: { id: report.id, traineeId: currentUser.id } })
    })
    navigate('/')
  }

  const unarchiveReport = () => {
    void updateReport({ status: ReportStatus.Reopened }).then(() => {
      if (!report || !currentUser) return
      publishAllCommentsMutation({ variables: { id: report.id, traineeId: currentUser.id } })
    })
    navigate('/')
  }

  const finishedDays = report && getFinishedDays(report)

  const reportArchived = report?.status === ReportStatus.Archived
  const reportReview = report?.status === ReportStatus.Review
  const reportReopened = report?.status === ReportStatus.Reopened
  const reportTodo = report?.status === ReportStatus.Todo

  const renderReportPageBody = () => {
    if (!report || !currentUser || (currentUser.__typename !== 'Trainee' && currentUser.__typename !== 'Trainer'))
      return

    return (
      <Container overflow="visible">
        <ReportPageHeader report={report} currentUser={currentUser as Trainee} updateReport={updateReport} />

        <EntryOrderProvider>
          {report?.days.map((day) => (
            <StyledTopBorderWrapper key={day.id}>
              <DayInput
                term={term ? term : ''}
                day={day}
                disabled={reportArchived || reportReview || day.status === DayStatusEnum.Holiday}
                reportStatus={report.status}
                updateMessageDay={(msg, commentId) => updateDayComment(day, msg, commentId)}
                updateMessageEntry={(msg, commentId, entry) => updateEntryComment(entry, msg, commentId)}
              />
            </StyledTopBorderWrapper>
          ))}
        </EntryOrderProvider>

        {data?.currentUser && (
          <ReportPageFooter
            report={report}
            disabled={reportArchived || reportReview}
            user={data.currentUser}
            updateReport={updateReport}
            updateMessage={(msg, commentId) => updateReportComment(msg, commentId)}
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
            <PrimaryButton
              onClick={() => {
                if (finishedDays !== 5 && !report.department) {
                  addToast({
                    icon: 'Error',
                    title: strings.report.incomplete.title,
                    text: strings.report.incomplete.description,
                    type: 'error',
                  })
                  return
                }
                toggleHandoverModal()
              }}
            >
              {strings.report.handover}
            </PrimaryButton>
          )}
          {reportArchived && trainee === undefined && (
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

      {!loading && !report && <Navigate to="/report/missing" />}

      {!loading && (
        <>
          {renderReportPageBody()}

          {renderReportPageButtons()}

          <Modal show={showHandoverModal} customClose handleClose={toggleHandoverModal}>
            <H2>{strings.formatString(strings.report.modalTitle.handover, strings.weekOverview.week, week ?? '')}</H2>
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
            <H2>{strings.formatString(strings.report.modalTitle.unarchive, strings.weekOverview.week, week ?? '')}</H2>
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
