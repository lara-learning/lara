import React from 'react'

import { H1, Paragraph, Flex } from '@lara/components'

import Illustrations from '../components/illustration'
import Loader from '../components/loader'
import TraineeReportsOverview from '../components/trainee-reports-overview'
import { Trainer, useTrainerReportsPageDataQuery } from '../graphql'
import { useIsDarkMode } from '../hooks/use-is-dark-mode'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const TrainerReportsPage: React.FunctionComponent = () => {
  const { loading, data } = useTrainerReportsPageDataQuery()
  const isDarkMode = useIsDarkMode(data?.currentUser)

  const currentUser = data?.currentUser as Trainer

  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading &&
        currentUser.trainees.map((trainee, index) => <TraineeReportsOverview key={index} trainee={trainee} />)}

      {!loading && !currentUser.trainees.length && (
        <Flex alignItems={'center'} flexDirection={'column'} mt={'3'} style={{ overflow: 'hidden' }}>
          <H1 center>{strings.trainerReportsPage.emptyState.title}</H1>
          <Paragraph center>{strings.trainerReportsPage.emptyState.caption} </Paragraph>
          <Illustrations.EmptyStateWaiting darkMode={isDarkMode} />
        </Flex>
      )}
    </Template>
  )
}

export default TrainerReportsPage
