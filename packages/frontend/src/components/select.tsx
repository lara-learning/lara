import React from 'react'

import {
  SelectWithIconProps,
  StyledInnerSelect,
  StyledSelectIcon,
  StyledSelectLabel,
  StyledSelectWithIconContainer,
} from '@lara/components'

export const SelectWithIcon: React.FC<SelectWithIconProps> = ({ label, icon, disabled, onChange, ...selectProps }) => {
  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <StyledSelectLabel>
      {label}
      <StyledSelectWithIconContainer hasLabel={Boolean(label)} disabled={disabled}>
        {icon && <StyledSelectIcon name={icon} color="iconBlue" size={'30px'} />}
        <StyledInnerSelect disabled={disabled} onChange={handleChange} {...selectProps} />
      </StyledSelectWithIconContainer>
    </StyledSelectLabel>
  )
}
