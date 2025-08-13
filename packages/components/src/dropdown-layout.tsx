import React from 'react'
import { Link } from 'react-router'
import styled, { css } from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

const DropdownContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active?: boolean }>`
  display: ${(props) => (props.active ? 'grid' : 'none')};
  z-index: 6;
  position: fixed;
  top: ${Spacings.xl};
  right: ${Spacings.l};
  padding: ${Spacings.m};
  grid-template-columns: 1fr;
  grid-gap: ${Spacings.xxs};
  background: ${(props) => props.theme.surface};
  border-radius: ${BorderRadii.xs};
  box-shadow: 0 7px 14px 0 rgba(30, 39, 49, 0.1);
`

const itemStyles = css`
  font-size: ${FontSizes.copy};
  text-decoration: none;
  text-align: left;
  padding: ${Spacings.m};
  border-radius: ${BorderRadii.xs};
  color: ${(props) => props.theme.mediumFont};
  background: ${(props) => props.theme.surface};
  user-select: none;
  cursor: pointer;
`

const DropdownLink = styled(Link)`
  ${itemStyles};

  &:hover,
  &:focus {
    color: ${(props) => props.theme.blueFont};
    background: ${(props) => props.theme.secondaryHovered};
  }
`

const Logout = styled.button`
  ${itemStyles};
  border: none;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.buttonSecondaryDangerHovered};
    background: ${(props) => props.theme.secondaryDangerHovered};
  }
`

interface DropdownLayoutProps {
  active?: boolean
  link: string
  helpString?: string
  logoutString?: string
  logout: () => void
}

export const DropdownLayout: React.FC<DropdownLayoutProps> = ({ active, link, helpString, logoutString, logout }) => {
  return (
    <DropdownContainer active={active}>
      <DropdownLink to={link}>{helpString}</DropdownLink>
      <Logout onClick={() => logout()}>{logoutString}</Logout>
    </DropdownContainer>
  )
}
