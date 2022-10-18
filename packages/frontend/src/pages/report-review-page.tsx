import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

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
} from '@lara/components'
import { Box, Flex } from '@rebass/grid'

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
  ReportReviewPageDataQueryVariables,
  ReportStatus,
  UpdateReportMutationVariables,
  useCreateCommentOnDayMutation,
  useCreateCommentOnReportMutation,
  useReportReviewPageDataQuery,
  UserInterface,
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

interface ReportReviewPageParams {
  trainee: string
  year: string
  week: string
  department: string
}

const ReportReviewPage: React.FunctionComponent<RouteComponentProps<ReportReviewPageParams>> = ({ match, history }) => {
  const variables: ReportReviewPageDataQueryVariables = {
    year: parseInt(match.params.year, 10),
    week: parseInt(match.params.week, 10),
    trainee: match.params.trainee,
  }

  const { getTotalMinutes } = useDayHelper()

  const { loading, data } = useReportReviewPageDataQuery({ variables })
  const [createCommentOnDayMutation] = useCreateCommentOnDayMutation()
  const [createCommentOnReportMutation] = useCreateCommentOnReportMutation()
  const [updateReportMutation] = useUpdateReportReportReviewPageMutation()
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
    updateReport({ status: ReportStatus.Reopened }).then(() => {
      addToast({
        icon: 'Report',
        title: strings.trainerReportOverview.reportDeclinedSuccessTitle,
        text: strings.trainerReportOverview.reportDeclinedSuccess,
        type: 'success',
      })
      history.push('/')
    })
  }

  const archiveReport = () => {
    updateReport({ status: ReportStatus.Archived }).then(() => {
      addToast({
        icon: 'Report',
        title: strings.trainerReportOverview.reportToArchiveSuccessTitle,
        text: strings.trainerReportOverview.reportToArchiveSuccess,
        type: 'success',
      })
      history.push('/')
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
        comments: (Pick<Comment, 'id' | 'text'> & {
          user: Pick<UserInterface, 'id' | 'avatar' | 'firstName' | 'lastName'>
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

  const getHeading = (day: Pick<Day, 'date'>): string => {
    return DateHelper.format(Date.parse(day.date), 'EEEE')
  }

  const report = data?.reportForTrainee

  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading && (!report || report.status !== ReportStatus.Review) && <Redirect to="/report/missing" />}

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
            <CommentSection bottomSpace comments={report.comments} onSubmit={commentOnReport} displayTextInput={true} />
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
