import React from 'react'

import { H2, Spacer, StyledTopBorderWrapper, Flex, Box } from '@lara/components'

import { Comment, Day, Entry, Report, ReportStatus, useCreateCommentOnReportMutation, UserInterface } from '../graphql'
import strings from '../locales/localization'
import CommentSection from './comment-section'
import { TextArea } from './text-area'
import Total from './total'
import { useReportHelper } from '../helper/report-helper'
import { useToastContext } from '../hooks/use-toast-context'

interface ReportPageFooterProps {
  report: Pick<Report, 'id' | 'summary' | 'status'> & {
    comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
      user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
    })[]
    days: (Pick<Day, 'status'> & {
      entries: ({ __typename?: 'Entry' } & Pick<Entry, 'time'>)[]
    })[]
  }
  user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
  disabled: boolean
  updateReport: (values: Partial<Report>) => Promise<void>
  updateMessage?: (message: string, commentId: string) => void
}

const ReportPageFooter: React.FunctionComponent<ReportPageFooterProps> = ({
  disabled,
  report,
  updateReport,
  user,
  updateMessage,
}) => {
  const [createCommentOnReportMutation] = useCreateCommentOnReportMutation()

  const { addToast } = useToastContext()
  const { getTotalMinutes } = useReportHelper()

  const updateRemarks = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement

    const isBlank = !target.value && !report.summary
    if (target.value === report.summary || isBlank) {
      return
    }

    updateReport({ summary: target.value })
  }

  const commentOnReport = (text: string) => {
    void createCommentOnReportMutation({
      variables: {
        id: report.id,
        text,
        traineeId: user.id,
      },
      optimisticResponse: {
        createCommentOnReport: {
          __typename: 'CreateCommentPayload',
          commentable: {
            __typename: 'Report',
            ...report,
            comments: [
              ...report.comments,
              {
                __typename: 'Comment',
                id: 'null',
                text,
                user,
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

  return (
    <StyledTopBorderWrapper>
      <Spacer x={'l'} top={'l'}>
        <H2 noMargin>{strings.report.remarks}</H2>
        <TextArea
          defaultValue={report.summary}
          disabled={disabled}
          placeholder={strings.report.remarksPlaceholder}
          onBlur={updateRemarks}
        />
      </Spacer>
      <CommentSection
        bottomSpace
        comments={report.comments}
        onSubmit={commentOnReport}
        displayTextInput={report.status === ReportStatus.Reopened}
        updateMessage={updateMessage}
      />
      <StyledTopBorderWrapper>
        <Spacer xy="l">
          <Box>
            <Flex justifyContent={'flex-end'} alignItems={'center'}>
              <Total perWeek primary minutes={getTotalMinutes(report)} />
            </Flex>
          </Box>
        </Spacer>
      </StyledTopBorderWrapper>
    </StyledTopBorderWrapper>
  )
}

export default ReportPageFooter
