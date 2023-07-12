/* eslint-disable no-octal */
import { H1, Spacer, Spacings, Text } from '@lara/components'
import { Box, Flex } from '@rebass/grid'
import { areIntervalsOverlapping } from 'date-fns'
import { GraphQLError } from 'graphql'
import React from 'react'
import {
  Timetable,
  TimetableInput,
  TimetableUpdateInput,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  Weekday,
} from '../graphql'
import { parseISODateString } from '../helper/date-helper'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'
import { TimeTableTitleInput } from './timetable-input-entry'
import { RenderTimetableComponent } from './timetable-table'

export type DayObject = {
  label: string
  value: Weekday | string
}

export const days: DayObject[] = [
  { label: '\u3000', value: '\u3000' },
  { label: 'monday', value: Weekday.Monday },
  { label: 'tuesday', value: Weekday.Tuesday },
  { label: 'wednesday', value: Weekday.Wednesday },
  { label: 'thursday', value: Weekday.Thursday },
  { label: 'friday', value: Weekday.Friday },
  { label: 'saturday', value: Weekday.Saturday },
]

export type HourObject = {
  label: string
  value: number
}
export const hours: HourObject[] = [
  { label: '07', value: 7 },
  { label: '08', value: 8 },
  { label: '09', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
]

export const TimeTableInputComponent: React.FC<{
  traineeId: string
  toggleModal: () => void
  noSaturday?: boolean
  editTimetable?: Timetable
  timetables?: Timetable[]
}> = ({ traineeId, toggleModal, noSaturday, editTimetable, timetables }) => {
  const [mutation] = useCreateTimetableMutation()
  const [updateMutation] = useUpdateTimetableMutation()
  const { addToast } = useToastContext()

  const initState = editTimetable
    ? editTimetable
    : {
        title: '',
        dateStart: '',
        dateEnd: '',
        traineeId,
        entries: [],
      }

  const [timetableInput, setTimetableInput] = React.useState<TimetableInput>(initState)
  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [message, setMessage] = React.useState<string>()

  const handleSubmit = async () => {
    if (editTimetable) {
      const input: TimetableUpdateInput = {
        ...timetableInput,
        id: editTimetable.id,
      }
      await updateMutation({ variables: { input } })
        .then(() => {
          addToast({
            text: strings.timetablePage.onBoarding.toast.success,
            type: 'success',
          })
        })
        .catch((exception: GraphQLError) => {
          addToast({
            text: exception.message,
            type: 'error',
          })
        })
    } else {
      const input: TimetableInput = {
        ...timetableInput,
      }
      await mutation({ variables: { input } })
        .then(() => {
          addToast({
            text: strings.timetablePage.onBoarding.toast.success,
            type: 'success',
          })
        })
        .catch((exception: GraphQLError) => {
          addToast({
            text: exception.message,
            type: 'error',
          })
        })
    }
    setTimetableInput(initState)
    toggleModal()
  }

  React.useEffect(() => {
    const hasTimeConflict = () => {
      if (timetableInput.dateStart && timetableInput.dateEnd) {
        const existingTimetable = timetables?.find((timetable) => {
          return (
            areIntervalsOverlapping(
              { start: parseISODateString(timetable.dateStart), end: parseISODateString(timetable.dateEnd) },
              { start: parseISODateString(timetableInput.dateStart), end: parseISODateString(timetableInput.dateEnd) },
              { inclusive: true }
            ) && timetable.id !== editTimetable?.id
          )
        })
        if (existingTimetable) {
          setMessage(strings.timetablePage.addTimetable.editEntry.timeConflict)
          return true
        }
      }
      setMessage(undefined)
      return false
    }

    if (
      timetableInput.title &&
      timetableInput.dateStart &&
      timetableInput.dateEnd &&
      timetableInput.entries.length > 0 &&
      !hasTimeConflict()
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [timetableInput, timetables])

  return (
    <>
      <H1>{strings.timetablePage.addTimetable.headline}</H1>
      <TimeTableTitleInput
        key={editTimetable?.id + 'title'}
        setTimetableInput={setTimetableInput}
        timetableInput={timetableInput}
        setDisable={setDisabled}
      />
      <RenderTimetableComponent
        key={editTimetable?.id}
        timetableInput={timetableInput}
        setTimetableInput={setTimetableInput}
        noSaturday={noSaturday}
      />
      <Flex justifyContent="flex-end" paddingTop={Spacings.m} alignItems="center">
        <Box width="50%">
          <Text>{message}</Text>
        </Box>
        <PrimaryButton value="yes" onClick={handleSubmit} disabled={disabled}>
          {strings.timetablePage.addTimetable.buttons.done}
        </PrimaryButton>
        <Spacer left="s">
          <SecondaryButton value="no" onClick={toggleModal}>
            {strings.timetablePage.addTimetable.buttons.cancel}
          </SecondaryButton>
        </Spacer>
      </Flex>
    </>
  )
}
