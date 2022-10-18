import { Text, Title } from '@lara/components'
import React from 'react'
import Accordion from '../components/accordion'
import Loader from '../components/loader'
import { useTraineePageDataQuery } from '../graphql'
import { Template } from '../templates/template'
import { parseDateToString } from './timetable-page'
import strings from '../locales/localization'

export const TimetableOverviewPage: React.FC = () => {
  const { loading, data } = useTraineePageDataQuery()

  if (loading) {
    return <Loader size="xl" padding="xl" />
  }

  if (!data) {
    return null
  }

  const { currentUser } = data

  if (!currentUser) {
    return null
  }

  return (
    <Template type="Main">
      {data.trainees.map((trainee) => (
        <Accordion fullWidth key={trainee?.id} title={trainee.firstName + ' ' + trainee.lastName}>
          <div>
            {trainee?.timetables && trainee?.timetables?.length >= 1 ? (
              trainee?.timetables.map((timetable) => (
                <div key={timetable?.dateEnd}>
                  <Title>{timetable?.title}</Title>
                  <Text size="copy">
                    {parseDateToString(timetable!.dateStart) + ' - ' + parseDateToString(timetable!.dateEnd)}
                  </Text>
                </div>
              ))
            ) : (
              <Text size="copy">{strings.timetablePage.noTimetable}</Text>
            )}
          </div>
        </Accordion>
      ))}
    </Template>
  )
}
