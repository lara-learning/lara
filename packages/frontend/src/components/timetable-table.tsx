import { H1, H2, Spacer, Text, TimeTableColumnWrapper, TimeTableGrid, TimeTableRow, Title } from '@lara/components'
import { Flex } from '@rebass/grid'
import { GraphQLError } from 'graphql'
import React from 'react'
import {
  TimetableEntry,
  TimetableEntryInput,
  TimetableInput,
  useDeleteTimetableEntryMutation,
  Weekday,
} from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Fab } from './fab'
import Modal from './modal'
import { days, DayObject, hours, HourObject } from './timetable-input'
import { TimetableEntryInputComponent } from './timetable-input-entry'

type TimetableProps = {
  timetableInput: TimetableInput
  setTimetableInput?: React.Dispatch<React.SetStateAction<TimetableInput>>
  viewOnly?: boolean
  timetableId?: string
  noSaturday?: boolean
}

export type EmptyField = {
  day: Weekday
  hour: number
}

export const RenderTimetableComponent: React.FC<TimetableProps> = ({
  timetableInput,
  setTimetableInput,
  viewOnly,
  timetableId,
  noSaturday,
}) => {
  const [showEntryDetails, setShowEntryDetails] = React.useState<boolean>(false)
  const [clickedEntry, setClickedEntry] = React.useState<EmptyField>()

  const [deleteMutation] = useDeleteTimetableEntryMutation()
  const { addToast } = useToastContext()

  const toggleEditEntry = () => setShowEntryDetails(!showEntryDetails)

  const gTemplate: (DayObject | HourObject)[][] = []
  const createArray = () => {
    for (let i = 0; i < days.length; i++) {
      if (noSaturday && days[i].value === Weekday.Saturday) continue
      gTemplate.push([days[i], ...hours.filter((hour) => hour.value !== 19)])
    }

    return gTemplate
  }

  /**
   * Generates a field inside the grid depending on existing entries and view/edit mode
   * @param iDay Index of day array (x-axis)
   * @param iHour Index of time array (y-axis)
   * @param day object (x-axis)
   * @param hour object (y-axis)
   * @param entries all entries of timetable
   * @returns JSX.Element | void
   */
  const createFieldForTimetable = (
    iDay: number,
    iHour: number,
    day: (DayObject | HourObject)[],
    hour: DayObject | HourObject,
    entries: TimetableEntry[] | TimetableEntryInput[]
  ): JSX.Element | void => {
    // Checks if the field to Render is headline for time or day
    if (iDay === 0 || iHour === 0) {
      return (
        <TimeTableRow rowStart={iHour + 1} key={day[iDay].label + hour.label} timeRow>
          {Object.values(Weekday).includes(hour.label as Weekday)
            ? strings.timetablePage.weekdays[hour.label as Weekday]
            : hour.label}
        </TimeTableRow>
      )
    }

    // checks entries for an entry in current time period
    const currentDay = days[iDay].value
    const entry = entries.find(
      (entry) => entry.day === currentDay && hour.value >= Number(entry.timeStart) && hour.value < Number(entry.timeEnd)
    )

    // returns if an entry exists and is not the first time slot of period
    // this leaves space inside the grid to render larger fields
    if (entry && entry.timeStart !== hour.value) {
      return
    }

    // checks for content inside the field
    const content = entry?.subject || '\u3000'

    // since the row start of a field depends on the hours index (iHour) we need the index of the hour
    // where the field is supposed to end inside the grid. Added "2" because of the index and the
    // way rows are counted inside grids
    const getRowEndFromTimeEnd = () => {
      const indexInHours = hours.findIndex((hour) => hour.value === entry?.timeEnd)
      return indexInHours === -1 ? undefined : indexInHours + 2
    }

    const handleClickField = (
      indexHour: number,
      indexDay: number,
      entry: TimetableEntry | TimetableEntryInput | undefined
    ) => {
      // needed for empty fields
      setClickedEntry({ day: days[indexDay].value as Weekday, hour: hours[indexHour - 1].value })

      // checks if modal for entryEdit should show up
      if (!viewOnly && entry) return
      toggleEditEntry()
    }

    return (
      <TimeTableRow
        key={day[iDay].label + hour.label}
        rowStart={iHour + 1}
        rowEnd={getRowEndFromTimeEnd()}
        timeRow={Boolean(iDay === 0)}
        onClick={() => handleClickField(iHour, iDay, entry)}
        entryRow={Boolean(entry?.subject)}
        viewOnly={viewOnly && !entry}
      >
        {content}
      </TimeTableRow>
    )
  }

  /**
   * Delete entry in viewOnly mode
   * @param entry entry to be removed
   * @returns
   */
  const handleRemove = (entry?: TimetableEntry) => {
    if (!timetableId || !entry) {
      addToast({
        text: strings.entryStatus.changeError,
        type: 'error',
      })
      return
    }

    // remove `__typename from object`
    const { __typename, ...rest } = entry

    deleteMutation({ variables: { input: rest, timetableId: timetableId } })
      .then(() => {
        addToast({
          text: strings.entryStatus.deleteSuccess,
          type: 'success',
        })
        toggleEditEntry()
      })
      .catch((exception: GraphQLError) => {
        addToast({
          text: exception.message,
          type: 'error',
        })
      })
  }

  const viewOnlyEntry =
    clickedEntry &&
    (timetableInput.entries.find(
      (entry) => clickedEntry.day === entry.day && clickedEntry.hour === entry.timeStart
    ) as TimetableEntry)

  return (
    <>
      <TimeTableGrid columns={days.length}>
        {/* creates the timetable grid */}
        {createArray().map((day, iDay) => (
          <TimeTableColumnWrapper column={iDay + 1} key={day[iDay].label} rows={hours.length + 1}>
            {day.map((hour, iHour) => createFieldForTimetable(iDay, iHour, day, hour, timetableInput.entries))}
          </TimeTableColumnWrapper>
        ))}
      </TimeTableGrid>
      {viewOnly && viewOnlyEntry ? (
        // modal to display entry details
        <Modal large timetable show={showEntryDetails} handleClose={toggleEditEntry} customClose={false}>
          <H2>{viewOnlyEntry?.subject}</H2>
          <Spacer bottom="m">
            <Flex flexDirection="column">
              <Title>{strings.timetablePage.addTimetable.editEntry.room}</Title>
              <Text size="copy">{viewOnlyEntry?.room}</Text>
              <Title>{strings.timetablePage.addTimetable.editEntry.teacher}</Title>
              <Text size="copy">{viewOnlyEntry?.teacher}</Text>
              <Title>{strings.timetablePage.addTimetable.editEntry.notes}</Title>
              <Text size="copy">{viewOnlyEntry?.notes}</Text>
              <Flex justifyContent="end">
                <Fab icon="Trash" inline danger onClick={() => handleRemove(viewOnlyEntry)} />
              </Flex>
            </Flex>
          </Spacer>
        </Modal>
      ) : timetableInput && setTimetableInput ? (
        // Modal to add entry in timetable
        <Modal large timetable show={showEntryDetails} handleClose={toggleEditEntry} customClose>
          <>
            <H1>{strings.timetablePage.addTimetable.editEntry.title}</H1>
            <TimetableEntryInputComponent
              key={clickedEntry?.day}
              toggleModal={toggleEditEntry}
              timetableInput={timetableInput}
              setTimetableInput={setTimetableInput}
              clickedEntry={clickedEntry}
            />
          </>
        </Modal>
      ) : null}
    </>
  )
}
