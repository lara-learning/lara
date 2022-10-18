import styled from 'styled-components'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

interface InputLabelProps {
  valid: boolean
}

export const StyledTextInputLabel = styled.label<InputLabelProps>`
  color: ${(props) => (props.valid ? props.theme.darkFont : props.theme.errorRed)};
  font-size: ${FontSizes.label};
  letter-spacing: 1.2px;
  font-style: normal;
  font-weight: bold;
  line-height: 14px;
  text-transform: uppercase;
  margin-bottom: ${Spacings.s};
  display: block;
  input[type='date'] {
    padding: 11px;
  }
  input[type='date']::-webkit-clear-button,
  input[type='date']::-webkit-inner-spin-button {
    display: none;
  }
  input[type='date']::-webkit-calendar-picker-indicator {
    display: none;
  }
`

interface InputContainerProps {
  valid: boolean
  floating: boolean
}

export const StyledTextInput = styled.input<InputContainerProps>`
  box-sizing: border-box;
  width: 100%;
  margin-top: ${Spacings.s};
  background: ${(props) => (props.floating ? props.theme.primaryPressed : props.theme.background)};
  box-shadow: ${(props) => (props.floating ? '0 2px 4px 0 rgba(27, 36, 48, 0.15)' : 'none')};
  font-size: ${FontSizes.copy};
  padding: ${Spacings.m};
  border: ${(props) => (props.floating ? 'none' : 'solid 1px')};
  border-color: ${(props) => (props.valid ? props.theme.inputBorderEmpty : props.theme.errorRed)};
  border-radius: ${BorderRadii.xxxs};
  outline: none;
  color: ${(props) => (props.valid ? props.theme.mediumFont : props.theme.errorRed)};
  transition: 0.3s all;
  :focus {
    color: ${(props) => props.theme.darkFont};
    /* TODO: Where does this color come from? */
    box-shadow: ${(props) => (props.floating ? '0 4px 8px 0 rgba(27, 36, 48, 0.25)' : 'none')};
  }
  ::placeholder {
    color: ${(props) => props.theme.lightFont};
  }
`
