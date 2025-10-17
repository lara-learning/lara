import React, { useEffect } from 'react'

import { DayInputLayout, StyledStatusLabel, H1, H2, IconName, StyledIcon } from '@lara/components'

import {
  Comment,
  Day,
  DayStatusEnum,
  Entry,
  ReportStatus,
  useCreateCommentOnDayMutation,
  useDayInputDataQuery,
  UserInterface,
  UserTypeEnum,
} from '../graphql'
import DateHelper from '../helper/date-helper'
import strings from '../locales/localization'
import CommentSection from './comment-section'
import DayStatusSelect from './day-status-select'
import EntriesInput from './entries-input'
import Loader from './loader'
import Total from './total'
import { useDayHelper } from '../helper/day-helper'
import { useToastContext } from '../hooks/use-toast-context'

export interface EntryStatusType {
  message?: string
  type: string
}

const StatusIcons: Record<string, IconName> = {
  success: 'Success',
  error: 'Error',
  loading: 'Loader',
}

export const StatusTypes = {
  save: {
    success: { message: strings.entryStatus.saveSuccess, type: 'success' },
    error: { message: strings.entryStatus.saveError, type: 'error' },
  },
  change: {
    success: { message: strings.entryStatus.changeSuccess, type: 'success' },
    error: { message: strings.entryStatus.changeError, type: 'error' },
  },
  delete: {
    success: { message: strings.entryStatus.deleteSuccess, type: 'success' },
    error: { message: strings.entryStatus.deleteError, type: 'error' },
  },
  loading: { type: 'loading' },
}

interface DayInputProps {
  day?: Pick<Day, 'id' | 'date' | 'status'> & {
    comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
      user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
    })[]
  } & {
    entries: (Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    })[]
  }
  heading?: string
  disabled?: boolean
  reportStatus?: ReportStatus
  primary?: boolean
  term: string
  updateMessageDay?: (message: string, commentId: string) => void
  updateMessageEntry?: (
    message: string,
    commentId: string,
    entry: Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    }
  ) => void
}

const DayInput: React.FunctionComponent<DayInputProps> = ({
  day,
  heading,
  disabled,
  reportStatus,
  primary,
  updateMessageDay,
  updateMessageEntry,
  term,
}) => {
  const { getTotalMinutes } = useDayHelper()
  const { addToast } = useToastContext()

  const { loading, data } = useDayInputDataQuery()
  const [createComment] = useCreateCommentOnDayMutation()

  const [status, setStatus] = React.useState<EntryStatusType & { icon: IconName }>({
    message: '',
    type: '',
    icon: 'Loader',
  })

  const [statusVisible, setStatusVisible] = React.useState(false)
  const [statusTimeout, setStatusTimeout] = React.useState<number>()

  useEffect(() => {
    return () => {
      clearTimeout(statusTimeout)
    }
  }, [statusTimeout])

  if (loading || !data) {
    return <Loader />
  }

  const getHeading = (): string => {
    if (!day) {
      return heading ?? ''
    }
    const date = Date.parse(day.date)

    return heading || `${DateHelper.format(date, 'EEEE')} – ${DateHelper.format(date, 'dd.MM.yyyy')}`
  }

  const shouldRenderEntriesInput = (): boolean => {
    if (!day) {
      return false
    }

    switch (day.status) {
      case DayStatusEnum.Work:
      case DayStatusEnum.Education:
        return true
      default:
        return false
    }
  }

  const isCommentable = () =>
    (reportStatus === ReportStatus.Review && data.currentUser?.type !== UserTypeEnum.Trainee) ||
    reportStatus === ReportStatus.Reopened

  const commentOnDay = (text: string) => {
    if (!data.currentUser || !day) {
      return
    }

    void createComment({
      variables: {
        id: day.id,
        text,
        traineeId: data.currentUser.id,
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
                id: 'null',
                text,
                user: data.currentUser,
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

  const handleStatusChange = (newStatus: EntryStatusType) => {
    clearTimeout(statusTimeout)

    setStatus({ ...newStatus, icon: StatusIcons[newStatus.type] })
    setStatusVisible(true)

    if (newStatus.type !== 'loading') {
      const timeout = window.setTimeout(() => {
        setStatusVisible(false)
      }, 1000)

      setStatusTimeout(timeout)
    }
  }

  if (!data.currentUser) {
    return null
  }

  const InputHeading = primary ? H1 : H2

  return (
    <DayInputLayout
      showEntriesInput={shouldRenderEntriesInput()}
      inputHeader={
        <>
          <InputHeading noMargin>{getHeading()}</InputHeading>
          {day && <DayStatusSelect disabled={disabled} day={day} />}
        </>
      }
      statusVisibility={statusVisible}
      icon={
        <StyledIcon
          color={status.type === 'error' ? 'errorRed' : 'iconDarkGrey'}
          marginRight="s"
          size="15px"
          name={status.icon}
        />
      }
      statusLabel={<StyledStatusLabel error={status.type === 'error'}>{status.message ?? ''}</StyledStatusLabel>}
      total={day && <Total minutes={getTotalMinutes(day)} />}
      commentsection={
        reportStatus !== ReportStatus.Todo && day ? (
          <CommentSection
            comments={day.comments}
            onSubmit={commentOnDay}
            displayTextInput={isCommentable()}
            updateMessage={updateMessageDay}
          />
        ) : undefined
      }
    >
      <EntriesInput
        term={term}
        handleStatusChange={handleStatusChange}
        day={day}
        reportStatus={reportStatus ?? ReportStatus.Todo}
        disabled={Boolean(disabled)}
        trainee={data.currentUser}
        updateMessage={updateMessageEntry}
      />
    </DayInputLayout>
  )
}

export default DayInput
