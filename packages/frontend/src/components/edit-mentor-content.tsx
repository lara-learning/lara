import { GraphQLError } from 'graphql'
import React from 'react'

import { EditUserContentLayout } from '@lara/components'

import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { MentorForm, EditMentorFormData } from './mentor-form'
import { UserInfo } from './user-info'
import { Mentor, useUpdateMentorMutation } from '../graphql'

interface EditMentorProps {
  mentor: Pick<Mentor, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email' | 'startDate' | 'endDate' | 'deleteAt'>
}

export const EditMentor: React.FC<EditMentorProps> = ({ mentor }) => {
  const [mutate] = useUpdateMentorMutation()
  const { addToast } = useToastContext()

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
          firstName={mentor.firstName}
          lastName={mentor.lastName}
          avatar={mentor.avatar}
          deleteAt={mentor.deleteAt}
        />
      }
      form={<MentorForm blurSubmit mentor={mentor} submit={updateMentor} />}
      relatedUsers={<></>}
    />
  )
}
