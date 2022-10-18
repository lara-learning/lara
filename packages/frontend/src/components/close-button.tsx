import React from 'react'

import { StyledIcon, StyledCloseButton } from '@lara/components'

interface CloseButtonProps {
  onClick: () => void
}

export const CloseButton: React.FunctionComponent<CloseButtonProps> = ({ onClick }) => {
  return (
    <StyledCloseButton onClick={onClick}>
      <StyledIcon name={'X'} size="24px" color="iconDarkGrey" />
    </StyledCloseButton>
  )
}
