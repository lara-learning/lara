import React from 'react'

import strings from '../locales/localization'
import { StyledToggleBox, StyledToggleCircle, StyledToggleInput, Text } from '@lara/components'

interface Props {
  checked: boolean
  handleClick: () => void
}

const ToggleSwitch: React.FC<Props> = ({ checked, handleClick }) => (
  <StyledToggleBox checked={checked} onClick={handleClick}>
    <StyledToggleInput type="checkbox" />
    <Text noLineHeight size="smallCopy" color="headerFont">
      {checked ? strings.on : strings.off}
    </Text>
    <StyledToggleCircle checked={checked} />
  </StyledToggleBox>
)

export default ToggleSwitch
