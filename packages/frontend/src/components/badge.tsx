import React from 'react'

import { StyledBadge } from '@lara/components'

interface BadgeProps {
  text?: string
}

const Badge: React.FunctionComponent<BadgeProps> = (props) => {
  return <StyledBadge>{props.text}</StyledBadge>
}

export default Badge
