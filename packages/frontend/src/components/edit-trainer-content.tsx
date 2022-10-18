import { GraphQLError } from 'graphql'
import React from 'react'

import { EditUserContentLayout, RelatedUsersLayout, Text, UnstyledLink } from '@lara/components'

import { Trainee, Trainer, useUpdateTrainerMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { TrainerForm, EditTrainerFormData } from './trainer-form'
import { UserInfo } from './user-info'

interface EditTrainerProps {
  trainer: Pick<Trainer, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email' | 'deleteAt'> & {
    trainees: Pick<Trainee, 'id' | 'firstName' | 'lastName' | 'avatar'>[]
  }
}

export const EditTrainer: React.FC<EditTrainerProps> = ({ trainer }) => {
  const [mutate] = useUpdateTrainerMutation()
  const { addToast } = useToastContext()

  const updateTrainer = async (data: EditTrainerFormData) => {
    await mutate({
      variables: {
        id: trainer.id,
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
          avatar={trainer.avatar}
          firstName={trainer.firstName}
          lastName={trainer.lastName}
          deleteAt={trainer.deleteAt}
        />
      }
      form={<TrainerForm blurSubmit trainer={trainer} submit={updateTrainer} />}
      relatedUsers={
        <RelatedUsersLayout
          label={
            <Text size="label" color="mediumFont" weight={700} spacing="1.2px" uppercase>
              {strings.settings.associatedTrainees}
            </Text>
          }
          users={
            trainer.trainees.length ? (
              <>
                {trainer.trainees.map((trainee) => (
                  <UnstyledLink key={trainee.id} to={`/trainees/${trainee.id}`}>
                    <UserInfo
                      secondary
                      avatar={trainee.avatar}
                      firstName={trainee.firstName}
                      lastName={trainee.lastName}
                    />
                  </UnstyledLink>
                ))}
              </>
            ) : (
              <Text size="copy">{strings.settings.notAssociated}</Text>
            )
          }
        />
      }
    />
  )
}
