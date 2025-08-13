import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { Icons } from './icon-definitions'
import { Spacing, Spacings } from './spacing'

type SpacingKey = keyof Spacing
export type IconName = keyof typeof Icons

export interface IconContainerProps {
  width?: string
  height?: string
  size?: string
  background?: keyof DefaultTheme
  marginLeft?: SpacingKey
  marginRight?: SpacingKey
  marginTop?: SpacingKey
  marginBottom?: SpacingKey
  margin?: SpacingKey
  strokeColor?: SpacingKey
  color?: keyof DefaultTheme
}

export interface IconProps extends IconContainerProps {
  name: IconName
}

const findSpacing = (...args: (SpacingKey | undefined)[]) => {
  const spacing = args.find((arg) => Boolean(arg))
  if (!spacing) {
    return undefined
  }
  return Spacings[spacing]
}

const IconContainer = styled.i.withConfig({
  shouldForwardProp: (prop) => !['marginLeft', 'marginRight', 'marginTop', 'marginBottom'].includes(prop),
})<IconContainerProps>`
  width: ${(props) => props.width || props.size || '100%'};
  height: ${(props) => props.height || props.size || 'auto'};
  display: block;
  float: inherit;
  margin-left: ${(props) => findSpacing(props.marginLeft, props.margin)};
  margin-right: ${(props) => findSpacing(props.marginRight, props.margin)};
  margin-top: ${(props) => findSpacing(props.marginTop, props.margin)};
  margin-bottom: ${(props) => findSpacing(props.marginBottom, props.margin)};

  & svg {
    display: block;
    box-sizing: border-box;
    fill: ${(props) => props.color && props.theme[props.color]};
    width: 100%;
    height: 100%;
  }
`

export const StyledIcon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name]
  if (!IconComponent) {
    return null
  }
  return (
    <IconContainer {...props}>
      <IconComponent />
    </IconContainer>
  )
}
