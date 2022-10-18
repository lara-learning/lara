import styled, { DefaultTheme } from 'styled-components'

import { BorderRadii } from './border-radius'

interface StyledProgressBarProps {
  progress: number
  color?: keyof DefaultTheme
}

const Bar = styled.div`
  padding: 0;
  margin: 0;
  display: block;
  height: 9px;
  border-radius: ${BorderRadii.xxxs};
`

export const StyledProgressBarIndicator = styled(Bar)<StyledProgressBarProps>`
  width: ${(props) => (props.progress * 100).toString() + '%'};
  transition: width 0.5s;
  height: 100%;
  background: ${(props) => props.theme[props.color || 'successGreen']};
`

export const StyledProgressBarContainer = styled(Bar)`
  background: ${(props) => props.theme.progressBar};
  overflow: hidden;
`
