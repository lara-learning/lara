import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { Spacings } from './spacing'

interface StyleProps {
  checked: boolean
}

export const StyledToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

export const StyledToggleBox = styled.div<StyleProps>`
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 59px;
  min-height: 28px;

  padding-left: ${(props) => (!props.checked ? Spacings.xl : Spacings.xs)};
  padding-right: ${(props) => (props.checked ? Spacings.xl : Spacings.xs)};

  border-radius: ${BorderRadii.m};
  background-color: ${(props) => (props.checked ? props.theme.iconBlue : props.theme.inputBorderEmpty)};

  &:focus-within {
    &::before {
      content: '';
      box-sizing: border-box;
      position: absolute;
      border-radius: ${BorderRadii.s};
      top: 50%;
      left: 50%;
      width: calc(100% + ${Spacings.xs});
      height: calc(100% + ${Spacings.xs});
      border: 2px solid ${(props) => props.theme.inputBorderActive};
      transform: translate3d(-50%, -50%, 0px);
    }
  }
`

export const StyledToggleCircle = styled.div<StyleProps>`
  transition: all 0.4s ease;
  position: absolute;
  width: ${Spacings.l};
  height: ${Spacings.l};
  border-radius: ${BorderRadii.round};
  background-color: ${(props) => props.theme.surface};
  top: 50%;
  left: ${(props) => (props.checked ? '75%' : '25%')};
  transform: translate(-50%, -50%);
`
