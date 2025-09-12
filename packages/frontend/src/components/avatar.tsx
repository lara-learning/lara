import React, { useEffect } from 'react'

import { AvatarLayout, StyledIcon } from '@lara/components'
import { useAvatarSettingsGetSignedUrlMutation } from '../graphql'
import eventBus from '../helper/event-bus-helper'

interface AvatarProps {
  size: number
  id: string
}

export async function hashSeed(seed: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(seed.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const getAvatarURL = async (seed: string): Promise<string> => {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${await hashSeed(seed)}.`
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ size, id }) => {
  const [avatar, setAvatar] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [noImage, setNoImage] = React.useState(false)
  const [mutate] = useAvatarSettingsGetSignedUrlMutation()

  useEffect(() => {
    mutate({
      variables: {
        id,
      },
    }).then(({ data }) => {
      if (data?.getAvatarSignedUrl) {
        setAvatar(data.getAvatarSignedUrl)
      } else {
        getAvatarURL(id).then((hash) => setAvatar(hash))
      }
    })
  }, [mutate, id])

  eventBus.on('avatarUpdated', () => {
    mutate({
      variables: {
        id,
      },
    }).then(({ data }) => {
      if (data?.getAvatarSignedUrl) {
        setAvatar(data.getAvatarSignedUrl)
      } else {
        getAvatarURL(id).then((hash) => setAvatar(hash))
      }
    })
  })

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
      {avatar && !noImage && <img onLoad={() => setLoading(false)} onError={handleError} src={avatar} />}
    </AvatarLayout>
  )
}

export default Avatar
