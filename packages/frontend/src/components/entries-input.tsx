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
  term: string
  day?: Pick<Day, 'id' | 'date'> & {
    entries: (Pick<Entry, 'id' | 'text' | 'time' | 'orderId'> & {
      comments: (Pick<Comment, 'id' | 'text' | 'published'> & {
        user: Pick<UserInterface, 'id' | 'firstName' | 'lastName'>
      })[]
    })[]
  }
  trainee: Pick<Trainee, 'id'>
  reportStatus: ReportStatus
  secondary: boolean
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
  secondary,
  trainee,
  updateMessage,
  term,
}) => {
  const [createEntryMutation] = useCreateEntryMutation()
  const { addToast } = useToastContext()
  const [showContextMenu, setShowContextMenu] = React.useState('')

  const { isValidTimeUpdate } = useDayHelper()

  if (!day) {
    return null
  }

  const createEntry = (entry: EntryInputType) => {
    if (!isValidTimeUpdate(day, entry.time ? entry.time : entry.time_split!)) {
      addToast({ title: strings.errors.error, text: strings.entryStatus.dayLimitError, type: 'error' })
      return
    }

    handleStatusChange(StatusTypes.loading)

    if (!secondary) {
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
    } else {
      createEntryMutation({
        variables: {
          input: {
            text_split: entry.text_split,
            time_split: entry.time_split,
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
  }

  const isValidForInput = (entry: Pick<Entry, 'id' | 'text' | 'time' | 'orderId'>) => {
    if (secondary) {
      if (entry.text) {
        return false
      }
      return true
    } else {
      if (entry.text) {
        return true
      }
      return false
    }
  }

  return (
    <Spacer top="s">
      {day.entries
        .slice()
        .filter((entry) => isValidForInput(entry))
        .sort((a, b) => a.orderId - b.orderId)
        .map((entry) => (
          <EntryInput
            term={term}
            handleStatusChange={handleStatusChange}
            key={entry.id}
            secondary={secondary}
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
      {!disabled && <TextTimeInput clearOnSave={true} onSave={createEntry} secondary={secondary} />}
    </Spacer>
  )
}

export default EntriesInput
