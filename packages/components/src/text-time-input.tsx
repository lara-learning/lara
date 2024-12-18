import { FlexProps } from '@rebass/grid'
import React from 'react'
import styled, { css } from 'styled-components'
import { StyledEntryValueWrapper } from './entry-input-layout'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'

interface WrapperProps extends FlexProps {
  readonly focused: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledTextTimeInputWrapper = styled(({ focused, ...rest }: WrapperProps) => (
  <StyledEntryValueWrapper {...rest} />
))<WrapperProps>`
  border-bottom: 1px solid ${({ focused, theme }) => (focused ? theme.blueFont : theme.inputBorderEmpty)};
`

export const StyledInputBase = css`
  border: none;
  background-color: ${(props) => props.theme.surface};
  font-size: ${FontSizes.copy};
  color: ${(props) => props.theme.mediumFont};
  ::placeholder {
    color: ${(props) => props.theme.lightFont};
  }
`

export const StyledInputTextArea = styled.textarea`
  ${StyledInputBase};
  flex: 1;
  outline: none;
  padding: ${Spacings.m} 0 ${Spacings.m} 0;
  resize: none;
  line-height: 1.4;
  width: 100%;
`

export const StyledTime = styled.input`
  ${StyledInputBase};
  text-align: right;
  width: (100p) x;
  padding: ${Spacings.m} 0 ${Spacings.m} 0;
  outline: none;
  line-height: 1.4;
  margin-right: 46px;
`
