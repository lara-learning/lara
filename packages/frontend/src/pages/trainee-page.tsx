import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'

import { H1 } from '@lara/components'

import Loader from '../components/loader'
import TraineeRow from '../components/trainee-row'
import { useTraineePageDataQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'

interface TraineePageParams {
  trainee?: string
}

type TraineePageProps = RouteComponentProps<TraineePageParams>

const TraineePage: React.FunctionComponent<TraineePageProps> = ({ match }) => {
  const { loading, data } = useTraineePageDataQuery()

  const isActive = (id: string): boolean => {
    return id === match.params.trainee
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

const TraineePageWithRouter = withRouter(TraineePage)

export default TraineePageWithRouter
