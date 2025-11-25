import React from 'react'

import { StyledCheckboxIcon, IconName, StyledCheckBox, StyledCheckBoxInput } from '@lara/components'

interface CheckBoxProps {
  iconName: IconName
  checked: boolean
  disabled: boolean
  onClick: () => void
}

export const CheckBox: React.FunctionComponent<CheckBoxProps> = ({ checked, iconName, disabled, onClick }) => {
  return (
    <>
      {disabled || (
        <StyledCheckBox onClick={onClick} checked={checked}>
          <StyledCheckBoxInput type="checkbox" />
          <StyledCheckboxIcon checked={checked} name={iconName} size={'44px'} />
        </StyledCheckBox>
      )}
    </>
  )
}
