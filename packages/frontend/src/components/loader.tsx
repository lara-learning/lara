import React from 'react'

import { LoaderSize, StyledLoaderContainer, StyledIcon } from '@lara/components'

interface LoaderProps {
  padding?: string
  size?: string | LoaderSize
}

const Loader: React.FunctionComponent<LoaderProps> = (props) => {
  return (
    <StyledLoaderContainer padding={props.padding}>
      <StyledIcon name={'Loader'} size={props.size || LoaderSize.Medium} />
    </StyledLoaderContainer>
  )
}

export default Loader
