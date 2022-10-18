import React from 'react'

import { StyledCheckboxIcon, IconName, StyledCheckBox, StyledCheckBoxInput } from '@lara/components'

interface CheckBoxProps {
  iconName: IconName
  checked: boolean
  onClick: () => void
}

export const CheckBox: React.FunctionComponent<CheckBoxProps> = ({ checked, iconName, onClick }) => {
  return (
    <StyledCheckBox onClick={onClick} checked={checked}>
      <StyledCheckBoxInput type="checkbox" />
      <StyledCheckboxIcon checked={checked} name={iconName} size={'44px'} />
    </StyledCheckBox>
  )
}
