import React from 'react'
import { useNavigate } from 'react-router'

import { EditUserRowLayout } from '@lara/components'

import { Admin, Mentor, Trainee, Trainer } from '../graphql'
import strings from '../locales/localization'
import { SecondaryButton } from './button'
import { UserInfo } from './user-info'

type EditUser = Pick<Trainee | Trainer | Admin | Mentor, 'id' | 'firstName' | 'lastName' | 'deleteAt'>

interface EditUserRowProps {
  user: EditUser
  baseUrl: 'trainees' | 'trainer' | 'admins' | 'mentor'
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
      content={<UserInfo id={user.id} firstName={user.firstName} lastName={user.lastName} deleteAt={user.deleteAt} />}
      button={
        <SecondaryButton ghost onClick={navigateToEditPage}>
          {strings.edit}
        </SecondaryButton>
      }
    />
  )
}
