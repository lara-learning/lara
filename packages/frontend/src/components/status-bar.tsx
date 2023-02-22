import React, { useState } from 'react'

import { StyledStatusBar } from '@lara/components'

import { useDebugLoginMutation, useDebugSetUsertypeMutation, UserInterface } from '../graphql'
import { useAuthentication } from '../hooks/use-authentication'

type StatusBarProps = {
  currentUser?: Pick<UserInterface, 'type'>
}

const StatusBar: React.FunctionComponent<StatusBarProps> = ({ currentUser }) => {
  const { login } = useAuthentication()

  const [mutateUserType] = useDebugSetUsertypeMutation()
  const [mutateLogin] = useDebugLoginMutation()

  const [id, setId] = useState('')

  const devLogin = () => {
    setId('')

    mutateLogin({ variables: { id } }).then(({ data }) => {
      if (!data?._devloginuser) {
        return
      }

      login(data._devloginuser)
      location.reload()
    })
  }

  const selectUsertype = (event: React.FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement

    void mutateUserType({
      variables: {
        usertype: target.value,
      },
    }).then(() => location.reload())
  }

  return (
    <StyledStatusBar>
      {ENVIRONMENT.name} @ {TAG} {REVISION} ({BUILD_DATE})
      {currentUser && (
        <div>
          <label>
            Select Usertype:
            <select onChange={selectUsertype} value={currentUser && currentUser.type}>
              <option value="Trainee">Trainee</option>
              <option value="Trainer">Trainer</option>
              <option value="Mentor">Mentor</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
      )}
      <div>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && devLogin()}
        />
        <button onClick={devLogin}>Dev Login</button>
      </div>
    </StyledStatusBar>
  )
}

export default StatusBar
