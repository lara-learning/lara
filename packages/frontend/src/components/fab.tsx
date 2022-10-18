import React from 'react'

import { FabLayout, Icons, StyledIcon, FabLayoutProps } from '@lara/components'

interface FabProps extends FabLayoutProps {
  icon: keyof typeof Icons
}

export const Fab: React.FC<FabProps> = ({ icon, ...rest }) => {
  return (
    <FabLayout {...rest}>
      <StyledIcon name={icon} color="mediumFont" />
    </FabLayout>
  )
}
