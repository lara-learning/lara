import styled, { DefaultTheme } from 'styled-components'

import { FontSize, FontSizes } from './font-size'
import { Fonts } from './fonts'

export interface ParagraphProps {
  font?: string
  fontSize?: keyof FontSize
  color?: keyof DefaultTheme
  center?: boolean
  primary?: boolean
  noMargin?: boolean
  margin?: string
}

export const Paragraph = styled.p<ParagraphProps>`
  line-height: 1.4;
  color: ${(props) => (props.color ? props.theme[props.color] : props.theme.lightFont)};
  font-family: ${(props) => props.font || Fonts.primary};
  font-size: ${(props) => (props.fontSize ? FontSizes[props.fontSize] : FontSizes.copy)};
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  margin-bottom: ${(props) => (props.margin ? props.margin : 'inherit')} ${(props) => props.noMargin && 'margin: 0;'};
`
