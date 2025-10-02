import React from 'react'
import { Navigate, useParams, useNavigate } from 'react-router'

import {
  Container,
  H1,
  H2,
  Paragraph,
  Spacer,
  Spacings,
  StyledDepartmentHeadline,
  StyledTraineeName,
  StyledTotalContainer,
  Flex,
  Box,
} from '@lara/components'

import { PrimaryButton, SecondaryButton } from '../components/button'
import CommentSection from '../components/comment-section'
import DayStatusSelect from '../components/day-status-select'
import EntryInput from '../components/entry-input'
import Loader from '../components/loader'
import Modal from '../components/modal'
import Total from '../components/total'
import {
  Comment,
  Day,
  Entry,
  ReportReviewPageDataQueryVariables,
  ReportStatus,
  UpdateReportMutationVariables,
  useCreateCommentOnDayMutation,
  useCreateCommentOnReportMutation,
  useDeleteCommentOnDayMutation,
  useDeleteCommentOnEntryMutation,
  useDeleteCommentOnReportMutation,
  usePublishAllCommentsMutation,
  useReportReviewPageDataQuery,
  UserInterface,
  useUpdateCommentOnDayMutation,
  useUpdateCommentOnEntryMutation,
  useUpdateCommentOnReportMutation,
  useUpdateReportReportReviewPageMutation,
} from '../graphql'
import DateHelper from '../helper/date-helper'
import strings from '../locales/localization'
import { useToastContext } from '../hooks/use-toast-context'
import { Template } from '../templates/template'
import { useDayHelper } from '../helper/day-helper'

interface ReportReviewPageState {
  showApproveConfimationModal: boolean
  showDeclineConfimationModal: boolean
}

const ReportReviewPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { year, week, trainee } = useParams<{ year: string; week: string; trainee: string }>()

  const variables: ReportReviewPageDataQueryVariables = {
    year: parseInt(year ?? '', 10),
    week: parseInt(week ?? '', 10),
    trainee: trainee ?? '',
  }

  const { getTotalMinutes } = useDayHelper()

  const { loading, data } = useReportReviewPageDataQuery({ variables })
  const [createCommentOnDayMutation] = useCreateCommentOnDayMutation()
  const [createCommentOnReportMutation] = useCreateCommentOnReportMutation()
  const [updateReportMutation] = useUpdateReportReportReviewPageMutation()

  const [updateCommentOnReportMutation] = useUpdateCommentOnReportMutation()
  const [updateCommentOnDayMutation] = useUpdateCommentOnDayMutation()
  const [updateCommentOnEntryMutation] = useUpdateCommentOnEntryMutation()

  const [deleteCommentOnReportMutation] = useDeleteCommentOnReportMutation()
  const [deleteCommentOnDayMutation] = useDeleteCommentOnDayMutation()
  const [deleteCommentOnEntryMutation] = useDeleteCommentOnEntryMutation()

  const [publishAllCommentsMutation] = usePublishAllCommentsMutation()

  const { addToast } = useToastContext()

  const [state, setState] = React.useState<ReportReviewPageState>({
    showApproveConfimationModal: false,
    showDeclineConfimationModal: false,
  })

  const toggleApproveModal = () => {
    setState({
      ...state,
      showApproveConfimationModal: !state.showApproveConfimationModal,
    })
  }

  const toggleDeclineModal = () => {
    setState({
      ...state,
      showDeclineConfimationModal: !state.showDeclineConfimationModal,
    })
  }

  const handBackReport = () => {
    updateReport({ status: ReportStatus.Reopened })
      .then(() => {
        if (!data?.reportForTrainee) return
        publishAllCommentsMutation({ variables: { id: data?.reportForTrainee.id, traineeId: variables.trainee } })
      })
      .then(() => {
        addToast({
          icon: 'Report',
          title: strings.trainerReportOverview.reportDeclinedSuccessTitle,
          text: strings.trainerReportOverview.reportDeclinedSuccess,
          type: 'success',
        })
        navigate('/')
      })
  }

  const archiveReport = () => {
    updateReport({ status: ReportStatus.Archived })
      .then(() => {
        if (!data?.reportForTrainee) return
        publishAllCommentsMutation({ variables: { id: data?.reportForTrainee.id, traineeId: variables.trainee } })
      })
      .then(() => {
        addToast({
          icon: 'Report',
          title: strings.trainerReportOverview.reportToArchiveSuccessTitle,
          text: strings.trainerReportOverview.reportToArchiveSuccess,
          type: 'success',
        })
        navigate('/')
      })
  }

  const updateReport = (values: Partial<UpdateReportMutationVariables>) => {
    if (!data?.reportForTrainee) {
      return Promise.resolve()
    }

    return updateReportMutation({
      variables: {
        id: data?.reportForTrainee.id,
        ...values,
      },
    })
  }

  const commentOnReport = (text: string) => {
    if (!data) {
      return
    }

    const { reportForTrainee, currentUser } = data
    if (!reportForTrainee || !currentUser) {
      return
    }

    void createCommentOnReportMutation({
      variables: {
        id: reportForTrainee.id,
        text,
        traineeId: variables.trainee,
      },
      optimisticResponse: {
        createCommentOnReport: {
          __typename: 'CreateCommentPayload',
          commentable: {
            __typename: 'Entry',
            ...reportForTrainee,
            comments: [
              ...reportForTrainee.comments,
              {
                id: '',
                text,
                user: currentUser,
                published: false,
              },
            ],
          },
        },
      },
    }).then(() => {
      addToast({
        icon: 'Comment',
        title: strings.trainerReportOverview.reportCommentSuccessTitle,
        text: strings.trainerReportOverview.reportCommentSuccess,
        type: 'success',
      })
    })
  }

  const commentOnDay =
    (
      day: Pick<Day, 'id'> & {
        comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
          user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
        })[]
      }
    ) =>
    (text: string) => {
      if (!data?.currentUser) {
        return
      }

      void createCommentOnDayMutation({
        variables: {
          id: day.id,
          text,
          traineeId: variables.trainee,
        },
        optimisticResponse: {
          createCommentOnDay: {
            __typename: 'CreateCommentPayload',
            commentable: {
              __typename: 'Day',
              ...day,
              comments: [
                ...day.comments,
                {
                  __typename: 'Comment',
                  id: '',
                  text,
                  user: data?.currentUser,
                  published: false,
                },
              ],
            },
          },
        },
      }).then(() => {
        addToast({
          icon: 'Comment',
          title: strings.trainerReportOverview.reportCommentSuccessTitle,
          text: strings.trainerReportOverview.reportCommentSuccess,
          type: 'success',
        })
      })
    }

  function updateReportComment(text: string, commentId: string) {
    if (!data) {
      return
    }

    const { reportForTrainee, currentUser } = data
    if (!reportForTrainee || !currentUser) {
      return
    }
    if (text !== '') {
      void updateCommentOnReportMutation({
        variables: {
          id: reportForTrainee.id,
          text,
          traineeId: variables.trainee,
          commentId,
        },
      })
    } else {
      void deleteCommentOnReportMutation({
        variables: {
          id: reportForTrainee.id,
          traineeId: variables.trainee,
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
    if (!data?.currentUser) {
      return
    }
    if (text !== '') {
      void updateCommentOnDayMutation({
        variables: {
          id: day.id,
          text,
          traineeId: variables.trainee,
          commentId,
        },
      })
    } else {
      void deleteCommentOnDayMutation({
        variables: {
          id: day.id,
          traineeId: variables.trainee,
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

    const { currentUser: user } = data
    if (!user) {
      return
    }
    if (text !== '') {
      void updateCommentOnEntryMutation({
        variables: {
          id: entry.id,
          text,
          traineeId: variables.trainee,
          commentId,
        },
      })
    } else {
      void deleteCommentOnEntryMutation({
        variables: {
          id: entry.id,
          traineeId: variables.trainee,
          commentId,
        },
      })
    }
  }

  const getHeading = (day: Pick<Day, 'date'>): string => {
    return DateHelper.format(Date.parse(day.date), 'EEEE')
  }

  const report = data?.reportForTrainee

  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading && (!report || report.status !== ReportStatus.Review) && <Navigate to="/report/missing" />}

      {!loading && report && (
        <>
          <Flex alignItems="baseline" justifyContent="space-between">
            <Box>
              <H1>
                {strings.report.title} {report.year} {strings.weekOverview.week}
                {report.week}
              </H1>
            </Box>
            <Box width={'30%'} pl={`${Spacings.s}`}>
              <StyledDepartmentHeadline>
                <span>station {report.department}</span>
              </StyledDepartmentHeadline>
            </Box>
            <Box>
              <StyledTraineeName>{data?.currentUser?.firstName + ' ' + data?.currentUser?.lastName}</StyledTraineeName>
            </Box>
          </Flex>

          <Container>
            {!loading && (
              <Spacer top="l">
                {report.days.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <Spacer x={'l'}>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Box>
                          <H2>{getHeading(day)}</H2>
                        </Box>
                        <Box width={[2 / 5, 1 / 5]}>
                          <DayStatusSelect disabled={true} day={day} />
                        </Box>
                      </Flex>
                    </Spacer>
                    {day.status === 'work' || day.status === 'education' ? (
                      <>
                        {day.entries.map((entry, entryIndex) => (
                          <EntryInput
                            key={entryIndex}
                            entry={entry}
                            day={day}
                            disabled={true}
                            reportStatus={report.status}
                            trainee={{ id: variables.trainee }}
                            updateMessage={(msg, commentId) => updateEntryComment(entry, msg, commentId)}
                          />
                        ))}
                        <StyledTotalContainer>
                          <Total minutes={getTotalMinutes(day)} />
                        </StyledTotalContainer>
                      </>
                    ) : null}
                    <CommentSection
                      bottomSpace
                      comments={day.comments}
                      onSubmit={commentOnDay(day)}
                      displayTextInput={true}
                      updateMessage={(msg, commentId) => updateDayComment(day, msg, commentId)}
                    />
                  </div>
                ))}
              </Spacer>
            )}

            <Spacer x={'l'}>
              <H2>{strings.report.remarks}</H2>
            </Spacer>
            <Spacer x="l">
              <Paragraph>{report.summary}</Paragraph>
            </Spacer>
            <CommentSection
              bottomSpace
              comments={report.comments}
              onSubmit={commentOnReport}
              displayTextInput={true}
              updateMessage={(msg, commentId) => updateReportComment(msg, commentId)}
            />
          </Container>

          <Flex py={'3'} justifyContent="space-between">
            <Box>
              <SecondaryButton onClick={toggleDeclineModal}>{strings.report.decline}</SecondaryButton>
            </Box>
            <Box>
              <PrimaryButton onClick={toggleApproveModal} icon={'CheckCircle'}>
                {strings.report.accept}
              </PrimaryButton>
            </Box>
          </Flex>

          <Modal show={state.showApproveConfimationModal} customClose handleClose={toggleApproveModal}>
            <H2>
              {strings.formatString(
                strings.report.modalTitle.accept,
                strings.weekOverview.week,
                report.week.toString()
              )}
            </H2>
            <Paragraph>{strings.report.modalCopy.accept}</Paragraph>
            <Flex mt={'2'}>
              <Box pr={'2'} width={'1 / 2'}>
                <SecondaryButton fullsize onClick={toggleApproveModal}>
                  {strings.cancel}
                </SecondaryButton>
              </Box>
              <Box pl={'2'} width={'1 / 2'}>
                <PrimaryButton fullsize onClick={archiveReport}>
                  {strings.report.accept}
                </PrimaryButton>
              </Box>
            </Flex>
          </Modal>

          <Modal show={state.showDeclineConfimationModal} customClose handleClose={toggleDeclineModal}>
            <H2>
              {strings.formatString(
                strings.report.modalTitle.decline,
                strings.weekOverview.week,
                report.week.toString()
              )}
            </H2>
            <Paragraph>{strings.report.modalCopy.decline}</Paragraph>
            <Flex mt={'2'}>
              <Box pr={'2'} width={'1 / 2'}>
                <SecondaryButton fullsize onClick={toggleDeclineModal}>
                  {strings.cancel}
                </SecondaryButton>
              </Box>
              <Box pl={'2'} width={'1 / 2'}>
                <PrimaryButton fullsize onClick={handBackReport}>
                  {strings.report.decline}
                </PrimaryButton>
              </Box>
            </Flex>
          </Modal>
        </>
      )}
    </Template>
  )
}

export default ReportReviewPage
