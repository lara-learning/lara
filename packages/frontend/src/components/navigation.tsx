import React, { useState } from 'react'

import {
  StyledAvatarMenuItem,
  StyledAvatarText,
  StyledIcon,
  StyledLaraLink,
  StyledLink,
  StyledLogo,
  StyledLogoutItem,
  StyledMobileNavWrapper,
  StyledNavItem,
  StyledNavItemsWrapper,
  StyledNavWrapper,
} from '@lara/components'

import { useNavigationDataQuery, UserTypeEnum } from '../graphql'
import { useAuthentication } from '../hooks/use-authentication'
import strings from '../locales/localization'
import Avatar from './avatar'
import Dropdown from './dropdown'

const Navigation: React.FunctionComponent = () => {
  const { data, loading } = useNavigationDataQuery()

  const { logout } = useAuthentication()

  const [showOverlay, setShowOverlay] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550)

  React.useEffect(() => {
    const updateDimensions = () => {
      setIsMobile(window.innerWidth <= 550)
    }
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [setIsMobile])

  const toggleMenu = () => {
    setShowOverlay(!showOverlay)
  }

  const hideDropdown = React.useCallback(() => {
    setShowDropdown(!showDropdown)
    document.removeEventListener('click', hideDropdown)
  }, [showDropdown])

  React.useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', hideDropdown)
    }
  }, [showDropdown, hideDropdown])

  const renderTraineeNav = () => {
    return (
      <>
        <StyledNavItem exact to={'/'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.dashhboard}
        </StyledNavItem>
        <StyledNavItem to={'/paper'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.paper}
        </StyledNavItem>
        <StyledNavItem to={'/archive'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.archive}
        </StyledNavItem>
        <StyledNavItem to={'/settings'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.settings}
        </StyledNavItem>
      </>
    )
  }

  const renderTrainerNav = () => {
    return (
      <>
        <StyledNavItem to={'/reports'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.reports}
        </StyledNavItem>
        <StyledNavItem to={'/trainees'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.trainees}
        </StyledNavItem>
        <StyledNavItem to={'/paper'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.paper}
        </StyledNavItem>
        <StyledNavItem to={'/settings'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.settings}
        </StyledNavItem>
      </>
    )
  }
  const renderMentorNav = () => {
    return (
      <>
        <StyledNavItem to={'/paper'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.paper}
        </StyledNavItem>
        <StyledNavItem to={'/settings'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.settings}
        </StyledNavItem>
      </>
    )
  }

  const renderAdminNav = () => {
    return (
      <>
        <StyledNavItem to={'/trainees'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.trainees}
        </StyledNavItem>
        <StyledNavItem to={'/trainer'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.trainer}
        </StyledNavItem>
        <StyledNavItem to={'/mentor'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.mentor}
        </StyledNavItem>
        <StyledNavItem to={'/settings'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.settings}
        </StyledNavItem>
      </>
    )
  }

  const renderGeneralMobileNav = () => {
    return (
      <>
        <StyledNavItem to={'/support'} onClick={toggleMenu} isMobile={isMobile}>
          {strings.dropdown.help}
        </StyledNavItem>
        <StyledLogoutItem onClick={() => logout()}>{strings.dropdown.logout}</StyledLogoutItem>
      </>
    )
  }

  return (
    <>
      <StyledNavWrapper flexWrap={'wrap'} justifyContent={'space-between'}>
        <StyledLaraLink to={'/'}>
          <StyledLogo isInNav />
        </StyledLaraLink>
        {!loading && data && (
          <>
            {!isMobile && (
              <StyledNavItemsWrapper>
                {data.currentUser?.type === UserTypeEnum.Trainer && renderTrainerNav()}
                {data.currentUser?.type === UserTypeEnum.Trainee && renderTraineeNav()}
                {data.currentUser?.type === UserTypeEnum.Mentor && renderMentorNav()}
                {data.currentUser?.type === UserTypeEnum.Admin && renderAdminNav()}
              </StyledNavItemsWrapper>
            )}
            {isMobile ? (
              <StyledLink onClick={toggleMenu}>
                <StyledIcon name={showOverlay ? 'X' : 'BurgerMenu'} size={'30px'} />
              </StyledLink>
            ) : (
              <StyledAvatarMenuItem onClick={() => setShowDropdown(true)}>
                <StyledAvatarText>{data.currentUser?.firstName + ' ' + data.currentUser?.lastName}</StyledAvatarText>
                <Avatar size={35} image={data.currentUser?.avatar ?? ''} />
              </StyledAvatarMenuItem>
            )}
          </>
        )}
      </StyledNavWrapper>
      {!loading && data && showOverlay && isMobile && (
        <StyledMobileNavWrapper>
          {data.currentUser?.type === UserTypeEnum.Trainer && renderTrainerNav()}
          {data.currentUser?.type === UserTypeEnum.Trainee && renderTraineeNav()}
          {data.currentUser?.type === UserTypeEnum.Admin && renderAdminNav()}
          {renderGeneralMobileNav()}
        </StyledMobileNavWrapper>
      )}

      <Dropdown active={showDropdown} />
    </>
  )
}

export default Navigation
