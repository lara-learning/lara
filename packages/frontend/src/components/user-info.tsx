import React from 'react'

import { UserInfoLayout } from '@lara/components'
import strings from '../locales/localization'

import Avatar from './avatar'

type UserInfoProps = {
  firstName: string
  lastName: string
  avatar: string
  secondary?: boolean
  deleteAt?: string
}

export const UserInfo: React.FC<UserInfoProps> = ({ firstName, lastName, avatar, secondary, deleteAt }) => {
  return (
    <UserInfoLayout
      avatar={<Avatar size={48} image={avatar} />}
      name={firstName + ' ' + lastName}
      secondary={Boolean(secondary)}
      forDeletion={Boolean(deleteAt)}
      marking={strings.admin.marking}
    />
  )
}
