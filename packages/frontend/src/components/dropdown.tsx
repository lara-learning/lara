import React from 'react'

import { DropdownLayout } from '@lara/components'

import strings from '../locales/localization'
import { useAuthentication } from '../hooks/use-authentication'

interface DropdownProps {
  active?: boolean
}

const NavDropdown: React.FunctionComponent<DropdownProps> = ({ active }) => {
  const { logout } = useAuthentication()

  return (
    <DropdownLayout
      active={active}
      link={'/support'}
      helpString={strings.dropdown.help}
      logoutString={strings.dropdown.logout}
      logout={logout}
    ></DropdownLayout>
  )
}

export default NavDropdown
