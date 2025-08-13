import React from 'react'
import styled from 'styled-components'
import { Spacing, Spacings } from './spacing'

type SpacingKey = keyof Spacing

export interface SpacerProps {
  top?: SpacingKey
  bottom?: SpacingKey
  left?: SpacingKey
  right?: SpacingKey
  x?: SpacingKey
  y?: SpacingKey
  xy?: SpacingKey
  children: React.ReactNode
}

const findSpacing = (...args: (SpacingKey | undefined)[]) => {
  const spacing = args.find((arg) => Boolean(arg))
  if (!spacing) {
    return undefined
  }
  return Spacings[spacing]
}

export const Spacer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['top', 'bottom', 'left', 'right', 'x', 'y', 'xy'].includes(prop),
})<SpacerProps>`
  padding-top: ${(props) => findSpacing(props.top, props.y, props.xy)};
  padding-bottom: ${(props) => findSpacing(props.bottom, props.y, props.xy)};
  padding-left: ${(props) => findSpacing(props.left, props.x, props.xy)};
  padding-right: ${(props) => findSpacing(props.right, props.x, props.xy)};
`

export default Spacer
