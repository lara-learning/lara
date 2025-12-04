import React, { useContext } from 'react'

import {
  ActionDivider,
  ActionsWrapper,
  ActionTriangle,
  ContextMenuWrapper,
  EntryInputLayout,
  StyledAction,
  StyledCommentInput,
  StyledIcon,
} from '@lara/components'

import { EntryOrderContext } from '../context/entry-order'
import {
  Comment,
  Day,
  Entry,
  EntryInput as EntryInputType,
  ReportStatus,
  Trainee,
  useCreateCommentOnEntryMutation,
  useDeleteEntryMutation,
  useEntryInputDataQuery,
  UserInterface,
  UserTypeEnum,
  useUpdateEntryMutation,
  useUpdateEntryOrderMutation,
} from '../graphql'
import TimeConversion from '../helper/time-conversion'
import strings from '../locales/localization'
import CommentBox from './comment-box'
import { EntryStatusType, StatusTypes } from './day-input'
import Loader from './loader'
import TextInput from './text-input'
import TextTimeInput from './text-time-input'
import { useToastContext } from '../hooks/use-toast-context'
import { useDayHelper } from '../helper/day-helper'

interface EntryDisplayFieldProps {
  day: Pick<Day, 'id' | 'date'> & {
    entries: Pick<Entry, 'id' | 'text' | 'time' | 'time_split' | 'text_split'>[]
  }
  entry: Pick<Entry, 'id' | 'text' | 'time' | 'orderId' | 'time_split' | 'text_split'> & {
    comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
      user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
    })[]
  }
  trainee: Pick<Trainee, 'id'>
  disabled: boolean
  reportStatus?: ReportStatus
  secondary: boolean
  handleStatusChange?: (status: EntryStatusType) => void
  showContextMenu?: string
  setShowContextMenu?: React.Dispatch<React.SetStateAction<string>>
  updateMessage?: (message: string, commentId: string) => void
  term: string
}

const EntryInput: React.FC<EntryDisplayFieldProps> = ({
  entry,
  disabled,
  reportStatus,
  day,
  handleStatusChange,
  trainee,
  showContextMenu,
  secondary,
  setShowContextMenu,
  updateMessage,
  term,
}) => {
  const { loading, data } = useEntryInputDataQuery()

  const { isValidTimeUpdate } = useDayHelper()

  const context = useContext(EntryOrderContext)

  const [updateOrder, updateOrderResult] = useUpdateEntryOrderMutation()

  const isDraggedOver = context.targetDayId === day.id && context.targetOrderId === entry.orderId
  const isDragged = context.entry?.id === entry.id
  const dragFromTopToBottom =
    context.dayId === day.id &&
    context.targetOrderId &&
    context.entry?.orderId &&
    context.targetOrderId > context.entry.orderId

  const [createComment] = useCreateCommentOnEntryMutation()

  const [updateEntryMutation] = useUpdateEntryMutation()
  const [deleteEntryMutation] = useDeleteEntryMutation()

  const [editing, setEditing] = React.useState(false)
  const [showComment, setShowComment] = React.useState(false)
  const { addToast } = useToastContext()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const key = event.key

    if (key === 'Enter') {
      if (target.value.trim() === '') return
      commentOnEntry(target.value)

      target.value = ''
      toggleCommentInput()
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    if (target.value.trim() === '') return
    commentOnEntry(target.value)

    target.value = ''
    toggleCommentInput()
  }

  const commentOnEntry = (text: string) => {
    if (!data) {
      return
    }

    const { currentUser: user } = data
    if (!user) {
      return
    }

    void createComment({
      variables: {
        id: entry.id,
        text,
        traineeId: trainee.id,
      },
      optimisticResponse: {
        createCommentOnEntry: {
          __typename: 'CreateCommentPayload',
          commentable: {
            __typename: 'Entry',
            ...entry,
            comments: [
              ...entry.comments,
              {
                __typename: 'Comment',
                id: '',
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

  const isCommentable = () => {
    if (!data) {
      return
    }

    const { currentUser } = data
    return (
      (reportStatus === ReportStatus.Review && currentUser?.type !== UserTypeEnum.Trainee) ||
      reportStatus === ReportStatus.Reopened
    )
  }

  const toggleCommentInput = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      e.stopPropagation()
    }

    setShowComment(!showComment)
  }

  const statusChange = (status: EntryStatusType) => handleStatusChange && handleStatusChange(status)

  const handleSave = (newEntry: EntryInputType) => {
    setEditing(false)

    const previousTime = !secondary ? (entry.time ?? 0) : (entry.time_split ?? 0)
    const nextTime = !secondary ? (newEntry.time ?? 0) : (newEntry.time_split ?? 0)

    if (!isValidTimeUpdate(day, nextTime - previousTime)) {
      addToast({ text: strings.entryStatus.changeError, type: 'error' })
      return
    }

    const isUnchanged = !secondary
      ? newEntry.text === entry.text && newEntry.time === entry.time
      : newEntry.text_split === entry.text_split && newEntry.time_split === entry.time_split

    if (isUnchanged) {
      return
    }

    statusChange(StatusTypes.loading)
    if (!secondary) {
      updateEntryMutation({
        variables: {
          id: entry.id,
          input: {
            text: newEntry.text,
            time: newEntry.time,
          },
        },
        optimisticResponse: {
          updateEntry: {
            __typename: 'MutateEntryPayload',
            entry: {
              __typename: 'Entry',
              id: entry.id,
              ...newEntry,
            },
          },
        },
      })
        .then(() => statusChange(StatusTypes.change.success))
        .catch(() => statusChange(StatusTypes.change.error))
    } else {
      updateEntryMutation({
        variables: {
          id: entry.id,
          input: {
            text_split: newEntry.text_split,
            time_split: newEntry.time_split,
          },
        },
        optimisticResponse: {
          updateEntry: {
            __typename: 'MutateEntryPayload',
            entry: {
              __typename: 'Entry',
              id: entry.id,
              ...newEntry,
            },
          },
        },
      })
        .then(() => statusChange(StatusTypes.change.success))
        .catch(() => statusChange(StatusTypes.change.error))
    }
  }

  const handleDelete = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    setEditing(false)
    statusChange(StatusTypes.loading)
    if (e) {
      e.stopPropagation()
    }

    deleteEntryMutation({
      variables: {
        id: entry.id,
      },
      optimisticResponse: {
        deleteEntry: {
          __typename: 'MutateEntryPayload',
          day: {
            __typename: 'Day',
            ...day,
            entries: day.entries.filter(({ id }) => entry.id !== id),
          },
        },
      },
    })
      .then(() => handleStatusChange && handleStatusChange(StatusTypes.delete.success))
      .catch(() => handleStatusChange && handleStatusChange(StatusTypes.delete.error))
  }

  const toggleContextMenu = () => {
    if (setShowContextMenu) {
      if (showContextMenu !== entry.id) {
        setShowContextMenu(entry.id)
      } else {
        setShowContextMenu('')
      }
    }
  }

  const onDragEnter = React.useCallback(() => {
    if (day.id !== context.targetDayId) {
      context.setTargetDayId(day.id)
    }

    if (entry.orderId !== context.targetOrderId) {
      context.setTargetOrderId(entry.orderId)
    }
  }, [context, day, entry])

  const onDrop = React.useCallback(() => {
    if (!context.entry || !context.targetDayId || !context.targetOrderId) {
      return
    }

    return updateOrder({
      variables: {
        entryId: context.entry.id,
        dayId: context.targetDayId,
        orderId: context.targetOrderId,
      },
    }).then(() => {
      context.clearState()
    })
  }, [context, updateOrder])

  const onDragEnd: React.DragEventHandler<HTMLDivElement> = React.useCallback(() => {
    context.clearState()
  }, [context])

  const onDragStart = React.useCallback(() => {
    context.setDayId(day.id)
    context.setEntry(entry)
  }, [context, day, entry])

  if (loading) {
    return <Loader />
  }

  if (!data) {
    return null
  }

  return (
    <>
      {editing && !disabled ? (
        <TextTimeInput autoFocus entry={entry} onDelete={handleDelete} onSave={handleSave} secondary={secondary} />
      ) : (
        <EntryInputLayout
          term={term}
          clickable
          disabled={disabled}
          draggable={!disabled}
          isDraggedOver={isDraggedOver || updateOrderResult.loading}
          isDragged={isDragged}
          dragFromTopToBottom={Boolean(dragFromTopToBottom)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          text={!secondary ? entry.text! : entry.text_split!}
          time={TimeConversion.minutesToString(!secondary ? entry.time! : entry.time_split!)}
          clickHandler={setEditing}
          actions={
            <>
              {!disabled && (entry.text || entry.text_split) && !isCommentable() && (
                <StyledAction onClick={() => handleDelete()} danger>
                  <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'} />
                </StyledAction>
              )}
              {isCommentable() && disabled && (
                <StyledAction onClick={() => toggleCommentInput()}>
                  <StyledIcon name={'Comment'} size={'30px'} color={'iconBlue'} />
                </StyledAction>
              )}
              {isCommentable() && !disabled && (
                <>
                  <StyledAction onClick={() => toggleContextMenu()}>
                    <StyledIcon name={'Options'} size={'12px'} color={'iconBlue'} />
                  </StyledAction>
                  {showContextMenu == entry.id && (
                    <ContextMenuWrapper>
                      <ActionTriangle />
                      <ActionsWrapper>
                        <StyledAction onClick={() => toggleCommentInput()} noMargin={true}>
                          <StyledIcon name={'Comment'} size={'30px'} color={'iconBlue'} />
                        </StyledAction>
                        <ActionDivider />
                        <StyledAction onClick={() => handleDelete()} danger noMargin={true}>
                          <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'} />
                        </StyledAction>
                      </ActionsWrapper>
                    </ContextMenuWrapper>
                  )}
                </>
              )}
            </>
          }
        />
      )}
      <CommentBox comments={entry.comments} updateMessage={updateMessage} />
      {showComment && (
        <StyledCommentInput>
          <TextInput label={strings.report.comments.addCommentToEntry} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        </StyledCommentInput>
      )}
    </>
  )
}

export default EntryInput
