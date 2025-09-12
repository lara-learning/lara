import { Box, Flex, H2, Paragraph, Spacings } from '@lara/components'
import { PrimaryButton, SecondaryButton } from './button'
import strings from '../locales/localization'
import { useAvatarSettingsDataQuery, useAvatarSettingsGetSignedUrlMutation } from '../graphql'
import Loader from './loader'
import { styled } from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { BackendUrl } from '../apollo-provider'
import { useToastContext } from '../hooks/use-toast-context'
import eventBus from '../helper/event-bus-helper'
import { getAvatarURL } from './avatar'
import imageCompression from 'browser-image-compression'

async function compressToLimit(file: File, limitKB = 250): Promise<File> {
  let compressedFile = file
  let quality = 0.9

  while (compressedFile.size > limitKB * 1024 && quality > 0.1) {
    compressedFile = await imageCompression(file, {
      maxSizeMB: limitKB / 1024,
      maxWidthOrHeight: 512,
      initialQuality: quality,
      useWebWorker: true,
    })

    quality -= 0.1
  }

  if (compressedFile.size > limitKB * 1024) {
    throw new Error(`Could not compress under ${limitKB} KB`)
  }

  return compressedFile
}

const AvatarSettings: React.FunctionComponent = () => {
  const { loading, data } = useAvatarSettingsDataQuery()
  const [mutate] = useAvatarSettingsGetSignedUrlMutation()
  const { addToast } = useToastContext()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [hasCustomAvatar, setHasCustomAvatar] = useState<boolean>(false)

  const { currentUser } = data || {}

  useEffect(() => {
    if (!currentUser) return

    mutate({
      variables: {
        id: currentUser.id,
      },
    }).then(({ data }) => {
      if (data?.getAvatarSignedUrl) {
        setAvatar(data.getAvatarSignedUrl)
        setHasCustomAvatar(true)
      } else {
        getAvatarURL(currentUser.id).then((hash) => setAvatar(hash))
        setHasCustomAvatar(false)
      }
    })
  }, [currentUser, mutate])

  if (loading || !data) {
    return <Loader size="56px" padding="56px" />
  }

  if (!currentUser) {
    return null
  }

  eventBus.on('avatarUpdated', () => {
    if (!currentUser) return
    mutate({
      variables: {
        id: currentUser.id,
      },
    }).then(({ data }) => {
      if (data?.getAvatarSignedUrl) {
        setAvatar(data.getAvatarSignedUrl)
        setHasCustomAvatar(true)
      } else {
        getAvatarURL(currentUser.id).then((hash) => setAvatar(hash))
        setHasCustomAvatar(false)
      }
    })
  })

  async function handleAvatarUpload(file: File) {
    if (!currentUser) return

    const maxSize = 250 * 1024
    if (file.size > maxSize) {
      const prevSize = file.size
      file = await compressToLimit(file)
      console.log(
        `Successfully compressed image from ${(prevSize / 1024).toFixed(1)} KB to ${(file.size / 1024).toFixed(1)} KB (${((file.size / prevSize) * 100).toFixed(1)}% of original)`
      )

      if (file.size > maxSize) {
        addToast({
          icon: 'Error',
          title: strings.settings.avatar.toasts.errorCompression.title,
          text: strings.settings.avatar.toasts.errorCompression.description,
          type: 'error',
        })
        return
      }
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1]
      const response = await fetch(`${BackendUrl}/avatar`, {
        method: 'POST',
        headers: {
          authorization: 'allow',
          'Content-Type': file.type,
        },
        body: JSON.stringify({ id: currentUser.id, data: base64String }),
        credentials: 'include',
      })

      if (response.ok) {
        eventBus.emit('avatarUpdated', undefined)
        addToast({
          icon: 'Success',
          title: strings.settings.avatar.toasts.success.title,
          text: strings.settings.avatar.toasts.success.description,
          type: 'success',
        })
      } else {
        console.error('Upload failed:', await response.text())
        if (response.status === 413) {
          addToast({
            icon: 'Error',
            title: strings.settings.avatar.toasts.errorFileSize.title,
            text: strings.settings.avatar.toasts.errorFileSize.description,
            type: 'error',
          })
        }
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  async function removeAvatar() {
    if (!currentUser) return

    await fetch(`${BackendUrl}/avatar`, {
      method: 'DELETE',
      headers: {
        authorization: 'allow',
      },
      body: JSON.stringify({ id: currentUser.id }),
      credentials: 'include',
    })

    eventBus.emit('avatarUpdated', undefined)
  }

  return (
    <Flex flexWrap={'wrap'} justifyContent="space-between">
      <Box width={[0, 1 / 5, 1 / 5, 1 / 5]}>{avatar && <Avatar src={avatar} />}</Box>
      <Box width={[1, 3 / 4, 3 / 4, 3 / 4]}>
        <Flex alignItems="center">
          <H2 style={{ margin: 0 }}>{strings.settings.avatar.title}</H2>
        </Flex>
        <Paragraph margin={`${Spacings.s}`} color="darkFont" fontSize="copy">
          {strings.settings.avatar.description}
        </Paragraph>
        <Flex alignItems="center" justifyContent="space-between">
          <PrimaryButton icon={'Camera'} onClick={() => fileInputRef.current?.click()}>
            {hasCustomAvatar ? strings.settings.avatar.updateAvatar : strings.settings.avatar.addAvatar}
          </PrimaryButton>
          <div style={{ width: '10px', flexShrink: 0 }} />
          {hasCustomAvatar && (
            <SecondaryButton danger icon={'Trash'} onClick={() => removeAvatar()}>
              {strings.settings.avatar.removeAvatar}
            </SecondaryButton>
          )}
        </Flex>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
    </Flex>
  )
}

const Avatar = ({ src }: { src: string }) => {
  return <StyledImg src={src} />
}

const StyledImg = styled.img`
  width: 100%;
  border-radius: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`

export default AvatarSettings
