import {GraphQLError} from 'graphql'
import React from 'react'

import {
  EditUserContentLayout,
  RelatedUsersLayout,
  Text,
} from '@lara/components'

import {useToastContext} from '../hooks/use-toast-context'
import strings from '../locales/localization'
import {
  MentorForm,
  EditMentorFormData
} from './mentor-form'
import {UserInfo} from './user-info'
import {Mentor, useUpdateMentorMutation} from "../graphql";

interface EditMentorProps {
  mentor: Pick<Mentor, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email' | 'deleteAt'>
}

export const EditMentor: React.FC<EditMentorProps> = ({mentor}) => {
  const [mutate] = useUpdateMentorMutation()
  const {addToast} = useToastContext()

  const updateMentor = async (data: EditMentorFormData) => {
    await mutate({
      variables: {
        id: mentor.id,
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
          secondary
          firstName={mentor.firstName}
          lastName={mentor.lastName}
          avatar={mentor.avatar}
          deleteAt={mentor.deleteAt}
        />
      }
      form={<MentorForm blurSubmit mentor={mentor} submit={updateMentor}/>}
      relatedUsers={
        <RelatedUsersLayout
          label={
            <Text size="label" color="mediumFont" weight={700} spacing="1.2px"
                  uppercase>
              {strings.settings.associatedTrainees}
            </Text>
          }
          users={
            (
              <Text size="copy">{strings.settings.notAssociated}</Text>
            )
          }
        />
      }
    />
  )
}
