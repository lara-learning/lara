import { GraphQLError } from 'graphql'
import React from 'react'

import { EditUserContentLayout } from '@lara/components'

import { Admin, useUpdateAdminMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { AdminForm, EditAdminFormData } from './admin-form'
import { UserInfo } from './user-info'

interface EditAdminProps {
  admin: Pick<Admin, 'id' | 'firstName' | 'lastName' | 'email' | 'deleteAt'>
}

export const EditAdmin: React.FC<EditAdminProps> = ({ admin }) => {
  const [mutate] = useUpdateAdminMutation()
  const { addToast } = useToastContext()

  const updateAdmin = async (data: EditAdminFormData) => {
    await mutate({
      variables: {
        id: admin.id,
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
      user={<UserInfo id={admin.id} firstName={admin.firstName} lastName={admin.lastName} deleteAt={admin.deleteAt} />}
      form={<AdminForm blurSubmit admin={admin} submit={updateAdmin} />}
    />
  )
}
