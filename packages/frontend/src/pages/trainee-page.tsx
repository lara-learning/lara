import React from 'react'
import { useParams } from 'react-router'

import { H1 } from '@lara/components'

import Loader from '../components/loader'
import TraineeRow from '../components/trainee-row'
import { useTraineePageDataQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const TraineePage: React.FunctionComponent = () => {
  const { trainee } = useParams()
  const { loading, data } = useTraineePageDataQuery()

  const isActive = (id: string): boolean => {
    return id === trainee
  }

  return (
    <Template type="Main">
      <H1>{strings.navigation.trainees}</H1>
      {loading && <Loader />}

      {!loading &&
        data?.trainees.map((trainee, index) => (
          <TraineeRow trainee={trainee} trainerId={data.currentUser?.id} key={index} active={isActive(trainee.id)} />
        ))}
    </Template>
  )
}

export default TraineePage
