import { GraphQLError } from 'graphql'
import React from 'react'

import {
  EditUserContentLayout,
  Flex,
  RelatedUsersLayout,
  Spacer,
  StyledUnclaimIcon,
  Text,
  UnstyledLink,
} from '@lara/components'

import { Company, Trainee, Trainer, useAdminUnclaimTraineeMutation, useUpdateTraineeMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { TraineeForm, EditTraineeFormData } from './trainee-form'
import { UserInfo } from './user-info'
import Loader from './loader'

interface EditTraineeProps {
  trainee: Pick<
    Trainee,
    'id' | 'firstName' | 'lastName' | 'startDate' | 'endDate' | 'startOfToolUsage' | 'email' | 'deleteAt'
  > & {
    trainer?: Pick<Trainer, 'id' | 'firstName' | 'lastName'>
    company: Pick<Company, 'id'>
  }
  companies: Pick<Company, 'id' | 'name'>[]
}

export const EditTraineeContent: React.FC<EditTraineeProps> = ({ trainee, companies }) => {
  const [mutate] = useUpdateTraineeMutation()
  const { addToast } = useToastContext()
  const [loading, setLoading] = React.useState(false)
  const [adminUnclaimTrainee] = useAdminUnclaimTraineeMutation()

  const unclaim = async () => {
    setLoading(true)

    await adminUnclaimTrainee({
      variables: {
        id: trainee.id,
      },
    })

    setLoading(false)
  }

  const updateTrainee = async (data: EditTraineeFormData) => {
    await mutate({
      variables: {
        id: trainee.id,
        input: data,
      },
    })
      .then(() => {
        addToast({
          icon: 'Settings',
          title: strings.settings.saveSuccessTitle,
          text: strings.settings.saveSuccess,
          type: 'success',
        })
      })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }

  return (
    <EditUserContentLayout
      user={
        <UserInfo
          id={trainee.id}
          firstName={trainee.firstName}
          lastName={trainee.lastName}
          deleteAt={trainee.deleteAt}
        />
      }
      form={<TraineeForm blurSubmit trainee={trainee} companies={companies} submit={updateTrainee} />}
      relatedUsers={
        <RelatedUsersLayout
          label={
            <Text size="label" color="mediumFont" weight={700} spacing="1.2px" uppercase>
              {strings.settings.associatedTrainer}
            </Text>
          }
          users={
            <>
              {trainee.trainer ? (
                <Flex>
                  <UnstyledLink to={`/trainer/${trainee.trainer.id}`}>
                    <UserInfo
                      secondary
                      id={trainee.trainer.id}
                      firstName={trainee.trainer.firstName}
                      lastName={trainee.trainer.lastName}
                    />
                  </UnstyledLink>

                  {loading ? (
                    <Loader size="24px" />
                  ) : (
                    <Spacer onClick={unclaim} xy="s">
                      <StyledUnclaimIcon size={'24px'} name={'Unclaim'} color="iconBlue" />
                    </Spacer>
                  )}
                </Flex>
              ) : (
                <Text size="copy">{strings.settings.notAssociated}</Text>
              )}
            </>
          }
        />
      }
    />
  )
}
