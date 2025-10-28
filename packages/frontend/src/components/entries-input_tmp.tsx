import React from 'react'

import { Spacer } from '@lara/components'

import {
  Comment,
  Day,
  Entry,
  EntryInput as EntryInputType,
  ReportStatus,
  Trainee,
  useCreateEntryMutation,
  UserInterface,
} from '../graphql'
import { EntryStatusType, StatusTypes } from './day-input'
import EntryInput from './entry-input'
import TextTimeInput from './text-time-input'
import strings from '../locales/localization'
import { useToastContext } from '../hooks/use-toast-context'
import { useDayHelper } from '../helper/day-helper'

interface EntriesInputProps {
  day?: Pick<Day, 'id' | 'date'> & {
    entries: (Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    })[]
  }
  trainee: Pick<Trainee, 'id'>
  reportStatus: ReportStatus
  disabled: boolean
  handleStatusChange: (status: EntryStatusType) => void
  updateMessage?: (
    message: string,
    commentId: string,
    entry: Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    }
  ) => void
}

const EntriesInput: React.FC<EntriesInputProps> = ({
  day,
  disabled,
  reportStatus,
  handleStatusChange,
  trainee,
  updateMessage,
}) => {
  const [createEntryMutation] = useCreateEntryMutation()
  const { addToast } = useToastContext()
  const [showContextMenu, setShowContextMenu] = React.useState('')

  const { isValidTimeUpdate } = useDayHelper()

  if (!day) {
    return null
  }

  const createEntry = (entry: EntryInputType) => {
    if (!isValidTimeUpdate(day, entry.time)) {
      addToast({ title: strings.errors.error, text: strings.entryStatus.dayLimitError, type: 'error' })
      return
    }

    handleStatusChange(StatusTypes.loading)

    createEntryMutation({
      variables: {
        input: {
          text: entry.text,
          time: entry.time,
        },
        dayId: day.id,
      },
      optimisticResponse: {
        createEntry: {
          __typename: 'MutateEntryPayload',
          day: {
            __typename: 'Day',
            ...day,
            entries: [
              ...day.entries,
              {
                __typename: 'Entry',
                id: 'null',
                ...entry,
                comments: [],
                orderId: day.entries.length,
              },
            ],
          },
        },
      },
    })
      .then(() => handleStatusChange(StatusTypes.save.success))
      .catch(() => handleStatusChange(StatusTypes.save.error))
  }

  return (
    <Spacer top="s">
      {day.entries
        .slice()
        .sort((a, b) => a.orderId - b.orderId)
        .map((entry) => (
          <EntryInput
            handleStatusChange={handleStatusChange}
            key={entry.id}
            disabled={disabled}
            entry={entry}
            day={day}
            reportStatus={reportStatus}
            trainee={trainee}
            showContextMenu={showContextMenu}
            setShowContextMenu={setShowContextMenu}
            updateMessage={updateMessage ? (msg, commentId) => updateMessage(msg, commentId, entry) : undefined}
          />
        ))}
      {!disabled && <TextTimeInput clearOnSave={true} onSave={createEntry} />}
    </Spacer>
  )
}

export default EntriesInput
