import React, { useState, useRef, useEffect } from 'react'
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
import { isWikiFeatureEnabled } from '../helper/wiki-helper'

const Navigation: React.FC = () => {
  const { data, loading } = useNavigationDataQuery()
  const { logout } = useAuthentication()

  const [showOverlay, setShowOverlay] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const { currentUser } = data || {}

  // Handle resizing
  useEffect(() => {
    const updateDimensions = () => setIsMobile(window.innerWidth <= 550)
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const toggleMenu = () => setShowOverlay((prev) => !prev)

  // Render functions
  const renderTraineeNav = () => (
    <>
      <StyledNavItem to="/" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.dashhboard}
      </StyledNavItem>
      <StyledNavItem to="/archive" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.archive}
      </StyledNavItem>
      <StyledNavItem to="/settings" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.settings}
      </StyledNavItem>
      {isWikiFeatureEnabled() && (
        <StyledNavItem to="/wiki" onClick={toggleMenu} isMobile={isMobile}>
          {strings.navigation.wiki}
        </StyledNavItem>
      )}
    </>
  )

  const renderTrainerNav = () => (
    <>
      <StyledNavItem to="/reports" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.reports}
      </StyledNavItem>
      <StyledNavItem to="/trainees" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.trainees}
      </StyledNavItem>
      <StyledNavItem to="/settings" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.settings}
      </StyledNavItem>
    </>
  )

  const renderAdminNav = () => (
    <>
      <StyledNavItem to="/trainees" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.trainees}
      </StyledNavItem>
      <StyledNavItem to="/trainer" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.trainer}
      </StyledNavItem>
      <StyledNavItem to="/settings" onClick={toggleMenu} isMobile={isMobile}>
        {strings.navigation.settings}
      </StyledNavItem>
    </>
  )

  const renderGeneralMobileNav = () => (
    <>
      <StyledNavItem to="/support" onClick={toggleMenu} isMobile={isMobile}>
        {strings.dropdown.help}
      </StyledNavItem>
      <StyledLogoutItem onClick={logout}>{strings.dropdown.logout}</StyledLogoutItem>
    </>
  )

  return (
    <>
      <StyledNavWrapper flexWrap="wrap" justifyContent="space-between">
        <StyledLaraLink to="/">
          <StyledLogo isInNav />
        </StyledLaraLink>

        {!loading && data && (
          <>
            {!isMobile && (
              <StyledNavItemsWrapper>
                {data.currentUser?.type === UserTypeEnum.Trainer && renderTrainerNav()}
                {data.currentUser?.type === UserTypeEnum.Trainee && renderTraineeNav()}
                {data.currentUser?.type === UserTypeEnum.Admin && renderAdminNav()}
              </StyledNavItemsWrapper>
            )}

            {isMobile ? (
              <StyledLink onClick={toggleMenu}>
                <StyledIcon name={showOverlay ? 'X' : 'BurgerMenu'} size="30px" />
              </StyledLink>
            ) : (
              <div ref={dropdownRef}>
                <StyledAvatarMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown((prev) => !prev)
                  }}
                >
                  <StyledAvatarText>{data.currentUser?.firstName + ' ' + data.currentUser?.lastName}</StyledAvatarText>
                  <Avatar size={35} id={currentUser?.id ?? ''} />
                </StyledAvatarMenuItem>

                <Dropdown active={showDropdown} />
              </div>
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
    </>
  )
}

export default Navigation
