import styled from 'styled-components'
import { FontSizes } from './font-size'
import { Fonts } from './fonts'

export interface HeaderProps {
  center?: boolean
  styleLight?: boolean
  noMargin?: boolean
}

const BaseHeader = styled.h1<HeaderProps>`
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  font-family: ${Fonts.secondary};
  font-weight: 700;
  color: ${(props) => props.theme.darkFont};
  user-select: none;
`

export const H1 = styled(BaseHeader).withConfig({
  shouldForwardProp: (prop) => !['center', 'noMargin'].includes(prop),
})`
  font-size: ${FontSizes.h1};
  letter-spacing: 0.9px;
  ${(props) => props.noMargin && 'margin: 0;'};
`

export const H2 = styled.h2.withConfig({
  shouldForwardProp: (prop) => !['center', 'noMargin'].includes(prop),
})<HeaderProps>`
  font-size: ${FontSizes.h2};
  letter-spacing: 0.9px;
  ${(props) => props.noMargin && 'margin: 0;'};
  color: ${(props) => props.theme.darkFont};
`

export const Title = styled(BaseHeader).withConfig({
  shouldForwardProp: (prop) => !['noMargin'].includes(prop),
})`
  font-size: ${FontSizes.copy};
  ${(props) => props.noMargin && 'margin: 0;'};
  font-family: ${Fonts.secondary};
  letter-spacing: 0.3px;
`
