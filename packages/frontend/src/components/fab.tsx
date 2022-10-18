import React from 'react'

import { FabLayout, Icons, StyledIcon, FabLayoutProps, DefaultTheme } from '@lara/components'

interface FabProps extends FabLayoutProps {
  icon: keyof typeof Icons
  color?: keyof DefaultTheme
}

export const Fab: React.FC<FabProps> = ({ icon, color, ...rest }) => {
  return (
    <FabLayout {...rest}>
      <StyledIcon name={icon} color={color ?? 'mediumFont'} />
    </FabLayout>
  )
}
