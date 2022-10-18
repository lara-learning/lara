import React from 'react'

import { StyledLinkProps, NavigationButtonLinkLayout, IconName, DefaultTheme, StyledIcon } from '@lara/components'

interface NavigationButtonLinkProps extends StyledLinkProps {
  icon?: IconName
  iconColor?: keyof DefaultTheme
  to: string
  label: string
}

const NavigationButtonLink: React.FunctionComponent<NavigationButtonLinkProps> = ({
  label,
  icon,
  iconColor,
  to,
  isLeft,
}: NavigationButtonLinkProps) => (
  <NavigationButtonLinkLayout
    isLeft={Boolean(isLeft)}
    to={to}
    label={label}
    icon={<>{icon && <StyledIcon color={iconColor} name={icon} size="35px" />}</>}
  />
)

export default NavigationButtonLink
