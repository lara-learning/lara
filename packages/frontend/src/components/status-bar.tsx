import React, { useState } from 'react'

import { StyledStatusBar } from '@lara/components'

import { useDebugLoginMutation, useDebugSetUsertypeMutation, UserInterface } from '../graphql'
import { useAuthentication } from '../hooks/use-authentication'
import { CustomDropdown } from './dev-role-dropdown'

type StatusBarProps = {
  currentUser?: Pick<UserInterface, 'type'>
}

const StatusBar: React.FunctionComponent<StatusBarProps> = ({ currentUser }) => {
  const { login } = useAuthentication()

  const [mutateUserType] = useDebugSetUsertypeMutation()
  const [mutateLogin] = useDebugLoginMutation()
  const [hoverVisible, setHoverVisible] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [id, setId] = useState('')

  const visible = hoverVisible || inputFocused || dropdownOpen

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

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'instant',
      })
    }, 100)
  }

  const handleMouseEnter = () => {
    scrollToBottom()
    setHoverVisible(true)
  }

  const handleMouseLeave = () => {
    setHoverVisible(false)
  }

  return (
    <StyledStatusBar onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} open={visible} id="status-bar">
      {ENVIRONMENT.name} @ {TAG} {REVISION} ({BUILD_DATE})
      {currentUser && (
        <div className="status-bar-div">
          <CustomDropdown
            value={currentUser?.type}
            onChange={(newType) =>
              selectUsertype({ target: { value: newType } } as React.ChangeEvent<HTMLSelectElement>)
            }
            onOpenChange={setDropdownOpen}
          />
        </div>
      )}
      <div className="status-bar-div">
        <input
          id="dev-login-user-id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && devLogin()}
          style={{ height: '18.5px' }}
        />
        <button id="dev-login-button" onClick={devLogin} style={{ height: '18.5px' }}>
          Dev Login
        </button>
      </div>
    </StyledStatusBar>
  )
}

export default StatusBar
