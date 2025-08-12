import React from 'react'
import { useNavigate } from 'react-router'

import { EditUserRowLayout } from '@lara/components'

import { Trainee, Trainer } from '../graphql'
import strings from '../locales/localization'
import { SecondaryButton } from './button'
import { UserInfo } from './user-info'

type EditUser = Pick<Trainee | Trainer, 'id' | 'firstName' | 'lastName' | 'avatar' | 'deleteAt'>

interface EditUserRowProps {
  user: EditUser
  baseUrl: 'trainees' | 'trainer'
}

export const EditUserRow: React.FunctionComponent<EditUserRowProps> = ({ user, baseUrl }) => {
  const navigate = useNavigate()
  const url = `/${baseUrl}/${user.id}`

  const navigateToEditPage = () => {
    navigate(url)
  }

  return (
    <EditUserRowLayout
      to={url}
      content={
        <UserInfo avatar={user.avatar} firstName={user.firstName} lastName={user.lastName} deleteAt={user.deleteAt} />
      }
      button={
        <SecondaryButton ghost onClick={navigateToEditPage}>
          {strings.edit}
        </SecondaryButton>
      }
    />
  )
}
