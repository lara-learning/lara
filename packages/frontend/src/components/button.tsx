import React, { ButtonHTMLAttributes } from 'react'

import { ButtonLayout, IconName, StyledIcon } from '@lara/components'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
  icon?: IconName
  danger?: boolean
  ghost?: boolean
}

export const PrimaryButton: React.FunctionComponent<ButtonProps> = (props) => {
  return (
    <ButtonLayout {...props} styling={'primary'} icon={props.icon && <StyledIcon name={props.icon} />}>
      {props.children}
    </ButtonLayout>
  )
}

export const SecondaryButton: React.FunctionComponent<ButtonProps> = (props) => {
  return (
    <ButtonLayout {...props} styling={'secondary'} icon={props.icon && <StyledIcon name={props.icon} />}>
      {props.children}
    </ButtonLayout>
  )
}
