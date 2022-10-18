import {
  Spacer,
  StyledTimetableSelect,
  Text,
  TextProps,
  TimeTableConfigInput,
  TimetableEntryFormLayout,
  To,
} from '@lara/components'
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import { useForm } from 'react-hook-form'
import { TimetableEntry, TimetableInput, Weekday } from '../graphql'
import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'
import { days, hours } from './timetable-input'
import { EmptyField } from './timetable-table'

type TimetableEntryInputType = {
  day: Weekday
  timeStart: string
  timeEnd: string
  subject: string
  teacher: string
  room: string
  notes: string
}

export const TimetableEntryInputComponent: React.FC<{
  toggleModal: () => void
  timetableInput: TimetableInput
  setTimetableInput: React.Dispatch<React.SetStateAction<TimetableInput>>
  clickedEntry?: EmptyField
  existingEntry?: TimetableEntry
}> = ({ toggleModal, timetableInput, setTimetableInput, clickedEntry, existingEntry }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<TimetableEntryInputType>({ mode: 'onBlur', reValidateMode: 'onChange' })

  const {
    timetablePage: {
      addTimetable: { editEntry },
    },
  } = strings

  React.useEffect(() => {
    if (clickedEntry) {
      setValue('day', clickedEntry.day)
      setValue('timeStart', clickedEntry.hour.toString())
      setValue('timeEnd', (clickedEntry.hour + 1).toString())
    }
  }, [clickedEntry, setValue])

  const onSubmit = handleSubmit((formData) => {
    setTimetableInput({
      ...timetableInput,
      entries: [
        ...timetableInput.entries,
        { ...formData, timeStart: parseInt(formData.timeStart, 10), timeEnd: parseInt(formData.timeEnd, 10) },
      ],
    })
    reset()
    toggleModal()
  })

  const onCancel = () => {
    reset()
    toggleModal()
  }

  // Checks for overlapping Entries
  const validateEntry = () => {
    const start = parseInt(getValues('timeStart') ?? 0)
    const end = parseInt(getValues('timeEnd') ?? 0)
    const day = getValues('day')
    if (end < start) return strings.validation.timeAfter
    return timetableInput.entries.find((entry) => {
      return (
        //  existing        |---------------|
        //  new       |-------------|
        (entry.day === day && end > entry.timeStart && end <= entry.timeEnd) ||
        //  existing        |---------------|
        //  new                     |-------------|
        (entry.day === day && start >= entry.timeStart && start < entry.timeEnd) ||
        //  existing        |---------------|
        //  new                |---------|
        (entry.day === day && start >= entry.timeStart && end <= entry.timeEnd) ||
        //  existing        |---------------|
        //  new       |---------------------------|
        (entry.day === day && start <= entry.timeStart && end >= entry.timeEnd)
      )
    })
      ? false
      : true
  }

  const inputLabelProps: TextProps = {
    spacing: '1.2px',
    weight: 700,
    size: 'label',
    uppercase: true,
    color: 'darkFont',
  }
  return (
    <TimetableEntryFormLayout
      onSubmit={onSubmit}
      weekdayInput={
        <>
          <Text {...inputLabelProps}>{editEntry.weekday}</Text>
          <StyledTimetableSelect
            defaultValue={clickedEntry?.day ?? Weekday.Monday}
            {...register('day', {
              required: strings.validation.required,
              validate: () => validateEntry() || strings.timetablePage.addTimetable.editEntry.timeConflict,
            })}
            error={Boolean(errors.day?.message)}
          >
            {days
              .filter((day) => day.label !== '\u3000')
              .map((day) => (
                <option key={day.value} value={day.value}>
                  {strings.timetablePage.weekdays[day.value as Weekday]}
                </option>
              ))}
          </StyledTimetableSelect>
        </>
      }
      timePeriodInput={
        <>
          <Text {...inputLabelProps}>{editEntry.timeperiod}</Text>
          <Flex flexDirection="row" alignItems="center">
            <StyledTimetableSelect
              {...register('timeStart', {
                required: strings.validation.required,
                validate: () => validateEntry() || strings.timetablePage.addTimetable.editEntry.timeConflict,
              })}
              error={Boolean(errors.timeStart?.message)}
            >
              {hours.map((time) => (
                <option key={'start' + time.value} value={time.value}>
                  {time.label}:00
                </option>
              ))}
            </StyledTimetableSelect>
            <Spacer left="m" right="m">
              <Text color="darkFont" size="copy">
                {strings.periodTo}
              </Text>
            </Spacer>
            <Text {...inputLabelProps}></Text>
            <StyledTimetableSelect
              {...register('timeEnd', {
                required: strings.validation.required,
                validate: () => validateEntry() || strings.timetablePage.addTimetable.editEntry.timeConflict,
              })}
              error={Boolean(errors.timeEnd?.message)}
            >
              {hours.map((time) => (
                <option key={'end' + time.value} value={time.value}>
                  {time.label}:00
                </option>
              ))}
            </StyledTimetableSelect>
          </Flex>
          <Box height={12} key={errors.timeEnd?.message}>
            <Text>{errors.timeEnd?.message || errors.timeStart?.message || ' '}</Text>
          </Box>
        </>
      }
      subjectInput={
        <Flex flexDirection="column" width="100%">
          <Text {...inputLabelProps}>{editEntry.subject}</Text>
          <TimeTableConfigInput
            {...register('subject', {
              required: strings.validation.required,
            })}
            defaultValue={existingEntry?.subject}
            error={Boolean(errors.subject)}
          />
          <Text>{errors.subject?.message || ' '} </Text>
        </Flex>
      }
      teacherInput={
        <Flex flexDirection="column" width="100%">
          <Text {...inputLabelProps}>{editEntry.teacher}</Text>
          <TimeTableConfigInput {...register('teacher')} defaultValue={existingEntry?.teacher} />
        </Flex>
      }
      roomInput={
        <Flex flexDirection="column" width="100%">
          <Text {...inputLabelProps}>{editEntry.room}</Text>
          <TimeTableConfigInput {...register('room')} defaultValue={existingEntry?.room} />
        </Flex>
      }
      notesInput={
        <Flex flexDirection="column" width="100%">
          <Text {...inputLabelProps}>{editEntry.notes}</Text>
          <TimeTableConfigInput {...register('notes')} defaultValue={existingEntry?.notes} />
        </Flex>
      }
      buttons={
        <Flex justifyContent="space-between">
          <PrimaryButton onClick={onSubmit} disabled={false}>
            {strings.timetablePage.addTimetable.buttons.done}
          </PrimaryButton>
          <SecondaryButton onClick={onCancel}>{strings.timetablePage.addTimetable.buttons.cancel}</SecondaryButton>
        </Flex>
      }
    />
  )
}

type TimetableInputType = {
  title: string
  dateStart: string
  dateEnd: string
}

export const TimeTableTitleInput: React.FC<{
  setTimetableInput: React.Dispatch<React.SetStateAction<TimetableInput>>
  timetableInput: TimetableInput
  setDisable: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setTimetableInput, timetableInput, setDisable }) => {
  const inputLabelProps: TextProps = {
    spacing: '1.2px',
    weight: 700,
    size: 'label',
    uppercase: true,
    color: 'darkFont',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TimetableInputType>()

  const onBlur = handleSubmit((formdata) => {
    if (errors) {
      setDisable(true)
    }
    setTimetableInput({ ...timetableInput, ...formdata })
    setDisable(false)
  })

  return (
    <form onSubmit={onBlur}>
      <Flex paddingBottom="32px" paddingTop="24px" justifyContent="space-between">
        <Flex flexDirection="column">
          <Text {...inputLabelProps}>{strings.timetablePage.addTimetable.titles.headline}</Text>
          <TimeTableConfigInput
            {...register('title', {
              required: strings.validation.required,
            })}
            disabled={false}
            onBlur={onBlur}
            error={Boolean(errors.title)}
            defaultValue={timetableInput.title}
          />
          <Text>{errors.title?.message}</Text>
        </Flex>
        <Flex flexDirection="column" paddingLeft="12px">
          <Text {...inputLabelProps}>{strings.timetablePage.addTimetable.titles.validity}</Text>
          <Flex>
            <TimeTableConfigInput
              {...register('dateStart', {
                required: strings.validation.required,
              })}
              type="Date"
              disabled={false}
              onBlur={onBlur}
              error={Boolean(errors.dateStart)}
              defaultValue={timetableInput.dateStart.slice(0, 10)}
            />
            <To>-</To>
            <Spacer left="m">
              <TimeTableConfigInput
                {...register('dateEnd', {
                  required: strings.validation.required,
                  validate: (v) => v > getValues('dateStart') || strings.validation.dateAfter,
                })}
                type="Date"
                disabled={false}
                onBlur={onBlur}
                error={Boolean(errors.dateEnd)}
                defaultValue={timetableInput.dateEnd.slice(0, 10)}
              />
            </Spacer>
          </Flex>
          <Text>{errors.dateStart?.message || errors.dateEnd?.message}</Text>
        </Flex>
      </Flex>
    </form>
  )
}
