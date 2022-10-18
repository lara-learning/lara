import React from 'react'

import { AvatarLayout, StyledIcon } from '@lara/components'

interface AvatarProps {
  size: number
  image: string
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ size, image }) => {
  const [loading, setLoading] = React.useState(true)
  const [noImage, setNoImage] = React.useState(false)

  const handleError = React.useCallback(() => {
    setLoading(false)
    setNoImage(true)
  }, [setLoading, setNoImage])

  return (
    <AvatarLayout
      size={size}
      loadingIcon={<>{loading && <StyledIcon name={'Loader'} />}</>}
      noImageIcon={<>{noImage && <StyledIcon name={'User'} size="75%" />}</>}
    >
      {image && !noImage && <img onLoad={() => setLoading(false)} onError={handleError} src={image} />}
    </AvatarLayout>
  )
}

export default Avatar
