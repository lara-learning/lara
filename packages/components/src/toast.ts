import styled, { DefaultTheme } from 'styled-components'

import { FontSizes } from './font-size'
import { Spacings } from './spacing'
import { BorderRadii } from './border-radius'
import { IconContainerProps } from './icons'

interface StyledToastProps {
  color: keyof DefaultTheme
  hidden?: boolean
}

export const StyledToast = styled.div<StyledToastProps>`
  padding: ${Spacings.m} ${Spacings.l};
  background: ${(props) => props.theme[props.color]};
  color: ${(props) => props.theme.darkFont};
  font-size: ${FontSizes.copy};
  width: 100%;
  display: grid;
  grid-gap: ${Spacings.m};
  grid-template-columns: min-content auto;
  align-items: flex-start;
  overflow: hidden;
  transition: all 1s;
  box-size: border-box;
`
export const StyledToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 400px;
  margin: ${Spacings.xl};
  z-index: 5;
`

export const StyledToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledIconWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['background'].includes(prop),
})<IconContainerProps>`
  display: flex;
  align-items: center;
  align-self: center;
  height: 50%;
  justify-content: center;
  border-radius: ${BorderRadii.s};
  background-color: ${(props) => (props.background ? props.theme[props.background] : 'none')};
`
