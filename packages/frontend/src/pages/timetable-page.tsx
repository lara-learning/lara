import { Spacer } from '@lara/components'
import { GraphQLError } from 'graphql'
import React, { useState } from 'react'
import Accordion from '../components/accordion'
import { PrimaryButton } from '../components/button'
import { Fab } from '../components/fab'
import Loader from '../components/loader'
import Modal from '../components/modal'
import { TimetableEmptyState } from '../components/timetable-empty'
import { TimeTableInputComponent } from '../components/timetable-input'
import { RenderTimetableComponent } from '../components/timetable-table'
import { TimetableSettingsOnboarding } from '../components/timetable-onboarding'
import { Timetable, useDeleteTimetableMutation, useTraineeTimetableDataQuery } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'

export const parseDateToString = (date: string): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const TimetablePage: React.FunctionComponent = () => {
  const { data, loading } = useTraineeTimetableDataQuery({})
  const [deleteTimetableMutation] = useDeleteTimetableMutation()
  const { addToast } = useToastContext()

  const [showTimetableModal, setShowTimetableModal] = useState(false)
  const [editTimetable, setEditTimetable] = useState<Timetable>()

  if (loading) {
    return <Loader size="xl" padding="xl" />
  }

  if (!data) {
    return null
  }

  const { currentUser } = data

  if (currentUser?.__typename !== 'Trainee') {
    return null
  }

  if (!currentUser) {
    return null
  }
  const { timetableSettings, timetables } = currentUser

  const toggleTimetableModal = () => setShowTimetableModal(!showTimetableModal)

  const handleRemove = async (id: string) => {
    return deleteTimetableMutation({
      variables: {
        timetableId: id,
      },
    })
      .then(() => {
        addToast({
          text: strings.timetablePage.onBoarding.toast.deleteSuccess,
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

  const handleEdit = (timetable: Timetable) => {
    // is needed to remove '__typename' from timetable and entries
    const { __typename, ...rest } = timetable
    const input = { ...rest, entries: rest.entries.map(({ __typename, ...rest }) => rest) }
    console.log(input)
    setEditTimetable(input)
    toggleTimetableModal()
  }

  const handleAdd = () => {
    setEditTimetable(undefined)
    toggleTimetableModal()
  }

  return (
    <Template type="Main">
      <>
        {/* Renders existing timetables or empty state */}
        {timetables && timetables?.length >= 1 ? (
          <>
            {timetables.map(
              (timetable) =>
                timetable?.entries && (
                  <Accordion
                    key={timetable?.id}
                    fullWidth
                    title={timetable.title}
                    subtitle={parseDateToString(timetable.dateStart) + ' - ' + parseDateToString(timetable.dateEnd)}
                  >
                    <>
                      <RenderTimetableComponent
                        timetableInput={timetable}
                        viewOnly
                        timetableId={timetable.id}
                        noSaturday={!timetableSettings?.weekendSchool}
                      />
                      <Spacer left="m">
                        <Fab icon="Trash" inline danger onClick={() => handleRemove(timetable.id)} />
                        <Fab icon="Settings" color="iconBlue" inline onClick={() => handleEdit(timetable)} />
                      </Spacer>
                    </>
                  </Accordion>
                )
            )}
            <PrimaryButton onClick={handleAdd}>{strings.timetablePage.add}</PrimaryButton>
          </>
        ) : (
          <TimetableEmptyState onClick={toggleTimetableModal} />
        )}
        {/* Modal with input for new timetable. If this is the first time, we render an onboarding to handle timetableSettings */}
        <Modal large timetable show={showTimetableModal} handleClose={toggleTimetableModal} customClose>
          {timetableSettings?.onBoardingTimetable ? (
            <TimeTableInputComponent
              key={editTimetable?.entries[editTimetable.entries.length - 1].id}
              traineeId={currentUser.id}
              toggleModal={toggleTimetableModal}
              noSaturday={!timetableSettings?.weekendSchool}
              editTimetable={editTimetable}
              timetables={timetables as Timetable[]}
            />
          ) : (
            <TimetableSettingsOnboarding />
          )}
        </Modal>
      </>
    </Template>
  )
}

export default TimetablePage
