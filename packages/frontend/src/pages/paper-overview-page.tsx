import { Text, Title } from '@lara/components'
import React from 'react'
import Accordion from '../components/accordion'
import Loader from '../components/loader'
import { Template } from '../templates/template'
import {useTraineePageDataQuery} from "../graphql";

export const PaperOverviewPage: React.FC = () => {
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
        <Accordion key={trainee?.id} title={trainee.firstName + ' ' + trainee.lastName}>
          <div>
            {trainee?.papers && trainee?.papers?.length >= 1 ? (
              trainee?.papers.map(paper => (
                <div key={paper?.periodEnd}>
                  <Title>{paper?.subject}</Title>
                  <Text size="copy">
                    {paper?.periodStart + ' - ' + paper?.periodEnd}
                  </Text>
                </div>
              ))
            ) : (
              <Text size="copy">{"strings.timetablePage.noTimetable"}</Text>
            )}
          </div>
        </Accordion>
      ))}
    </Template>
  )
}
