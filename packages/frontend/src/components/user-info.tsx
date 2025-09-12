import React from 'react'

import { UserInfoLayout } from '@lara/components'
import strings from '../locales/localization'

import Avatar from './avatar'

type UserInfoProps = {
  firstName: string
  lastName: string
  id: string
  secondary?: boolean
  deleteAt?: string
}

export const UserInfo: React.FC<UserInfoProps> = ({ firstName, lastName, id, secondary, deleteAt }) => {
  return (
    <UserInfoLayout
      avatar={<Avatar size={48} id={id} />}
      name={firstName + ' ' + lastName}
      secondary={Boolean(secondary)}
      forDeletion={Boolean(deleteAt)}
      marking={strings.admin.marking}
    />
  )
}
