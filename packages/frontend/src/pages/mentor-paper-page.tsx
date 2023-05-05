import {Text, Title} from '@lara/components'
import React from 'react'
import Accordion from '../components/accordion'
import Loader from '../components/loader'
import {Template} from '../templates/template'
import {useMentorPaperPageDataQuery} from "../graphql";
import {Mentor} from "@lara/api";

export const MentorPaperPage: React.FC = () => {
  const {loading, data} = useMentorPaperPageDataQuery()

  if (loading) {
    return <Loader size="xl" padding="xl"/>
  }

  if (!data) {
    return null
  }

  const currentUser = data?.currentUser as Mentor
  if (!currentUser) {
    return null
  }
  return (
    <Template type="Main">
        <div key={currentUser?.id}>
          {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
            currentUser?.papers.map(paper => (
              <Accordion key={paper?.id} title={paper?.client + ' ' + paper?.subject}>
                <div key={paper?.periodEnd}>
                  <Title>{paper?.subject}</Title>
                  <Text size="copy">
                    {paper?.periodStart + ' - ' + paper?.periodEnd}
                  </Text>
                </div>
              </Accordion>
            ))
          ) : (
            <Text size="copy">{"Kein Paper"}</Text>
          )}
        </div>
    </Template>
  )
}
