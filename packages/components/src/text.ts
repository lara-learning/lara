import styled, { DefaultTheme } from 'styled-components'
import { BorderRadii } from './border-radius'

import { FontSize, FontSizes } from './font-size'
import { Fonts } from './fonts'
import { Spacings } from './spacing'

export type TextProps = {
  size?: keyof FontSize
  color?: keyof DefaultTheme
  weight?: number
  font?: keyof typeof Fonts
  spacing?: string
  uppercase?: boolean
  background?: keyof DefaultTheme
  noLineHeight?: boolean
}

export const Text = styled.span.withConfig({
  shouldForwardProp: (prop) => !['noLineHeight'].includes(prop),
})<TextProps>`
  font-size: ${(props) => (props.size ? FontSizes[props.size] : FontSizes.label)};
  font-weight: ${(props) => props.weight};
  font-family: ${(props) => props.font && Fonts[props.font]};
  color: ${(props) => (props.color ? props.theme[props.color] : props.theme.mediumFont)};
  letter-spacing: ${(props) => props.spacing};
  text-transform: ${(props) => props.uppercase && 'uppercase'};
  background: ${(props) => (props.background ? props.theme[props.background] : undefined)};
  padding: ${(props) => (props.background ? `${Spacings.xxs} ${Spacings.s}` : '0')};
  border-radius: ${(props) => (props.background ? BorderRadii.xxs : '0')};
  ${(props) => props.noLineHeight && 'line-height: 1;'}
`
