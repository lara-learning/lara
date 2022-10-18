import { StyledProgressBarContainer, StyledProgressBarIndicator, DefaultTheme } from '@lara/components'
import React from 'react'

interface ProgressBarProps {
  progress: number
  color?: keyof DefaultTheme
}

const ProgressBar: React.FunctionComponent<ProgressBarProps> = (props) => (
  <StyledProgressBarContainer>
    <StyledProgressBarIndicator {...props} />
  </StyledProgressBarContainer>
)

export default ProgressBar
