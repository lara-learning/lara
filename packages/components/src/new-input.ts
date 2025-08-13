import styled from 'styled-components'
import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

export interface InputProps {
  error?: boolean
  block?: boolean
}

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['block', 'error'].includes(prop),
})<InputProps>`
  width: ${(props) => props.block && '100%'};
  background: ${(props) => props.theme.inputBackground};
  padding: ${Spacings.m};
  color: ${(props) => props.theme.mediumFont};
  border-radius: ${BorderRadii.xxs} ${BorderRadii.xxs} 0 0;
  border: none;
  border-bottom: solid 2px ${(props) => props.theme.lightFont};
  font-size: ${FontSizes.copy};
  display: block;
  transition: border-color 0.25s;

  &:active {
    color: ${(props) => props.theme.darkFont};
  }

  &:disabled {
    color: ${(props) => props.theme.lightFont};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? props.theme.errorRed : props.theme.inputBorderActive)};
  }

  border-color: ${(props) => props.error && props.theme.errorRed};

  &[type='date']::-webkit-clear-button,
  &[type='date']::-webkit-inner-spin-button,
  &[type='date']::-webkit-calendar-picker-indicator {
    display: none;
  }
`

export const ErrorText = styled.span`
  margin-top: ${Spacings.xxs};
  display: block;
  font-size: ${FontSizes.smallCopy};
  letter-spacing: 0.2px;
  color: ${(props) => props.theme.errorRed};
`
