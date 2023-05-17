import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'

export interface StyledLinkProps extends LinkProps {
  isLeft?: boolean
  alignLeft?: boolean
}

// isLeft props needs to be removed from LinkProps
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLink = styled(({ isLeft, alignLeft, ...rest }) => <Link {...rest} />)<StyledLinkProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.alignLeft ? 'flex-start' : 'center')};
  flex-direction: ${(props) => (props.isLeft ? 'row' : 'row-reverse')};
  border-radius: ${BorderRadii.xxs};
  text-decoration: none;
`

const Label = styled.div`
  text-align: center;
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.mediumFont};
  letter-spacing: 1.2px;
`

interface NavigationButtonLinkLayoutProps {
  icon: JSX.Element
  label: string
  isLeft: boolean
  alignLeft: boolean
  to: string
}

export const NavigationButtonLinkLayout: React.FC<NavigationButtonLinkLayoutProps> = ({
  icon,
  isLeft,
  alignLeft,
  label,
  to,
}) => {
  return (
    <StyledLink isLeft={isLeft} alignLeft={alignLeft} to={to}>
      {icon}
      <Label>{label}</Label>
    </StyledLink>
  )
}
