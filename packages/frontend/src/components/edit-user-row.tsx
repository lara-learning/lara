import React from 'react'
import { useHistory } from 'react-router-dom'

import { EditUserRowLayout } from '@lara/components'

import { Mentor, Trainee, Trainer } from '../graphql'
import strings from '../locales/localization'
import { SecondaryButton } from './button'
import { UserInfo } from './user-info'

type EditUser = Pick<Trainee | Trainer | Mentor, 'id' | 'firstName' | 'lastName' | 'avatar' | 'deleteAt'>

interface EditUserRowProps {
  user: EditUser
  baseUrl: 'trainees' | 'trainer' | 'mentor'
}

export const EditUserRow: React.FunctionComponent<EditUserRowProps> = ({ user, baseUrl }) => {
  const history = useHistory()
  const url = `/${baseUrl}/${user.id}`

  const navigateToEditPage = () => {
    history.push(url)
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
