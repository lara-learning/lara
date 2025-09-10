import { Box, Flex, H2, Paragraph, Spacings } from '@lara/components'
import { PrimaryButton, SecondaryButton } from './button'
import strings from '../locales/localization'
import { useAvatarSettingsDataQuery, useAvatarSettingsGetSignedUrlMutation } from '../graphql'
import Loader from './loader'
import { styled } from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { BackendUrl } from '../apollo-provider'

const AvatarSettings: React.FunctionComponent = () => {
  const { loading, data } = useAvatarSettingsDataQuery()
  const [mutate] = useAvatarSettingsGetSignedUrlMutation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatar, setAvatar] = useState<string | undefined>(data?.currentUser?.avatar)
  const [hasCustomAvatar, setHasCustomAvatar] = useState<boolean>(false)

  const { currentUser } = data || {}

  useEffect(() => {
    if (!currentUser) return

    mutate().then(({ data }) => {
      if (data?.getAvatarSignedUrl) {
        setAvatar(data.getAvatarSignedUrl)
        setHasCustomAvatar(true)
      } else {
        setAvatar(currentUser.avatar)
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

  async function handleAvatarUpload(file: File) {
    if (!currentUser) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1]
      await fetch(`${BackendUrl}/avatar`, {
        method: 'POST',
        headers: {
          authorization: 'allow',
          'Content-Type': file.type,
          'X-User-Id': currentUser.id,
        },
        body: JSON.stringify({ data: base64String }),
        credentials: 'include',
      })

      window.location.reload()
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
        'X-User-Id': currentUser.id,
      },
      credentials: 'include',
    })

    window.location.reload()
  }

  return (
    <Flex flexWrap={'wrap'} justifyContent="space-between">
      <Box width={[0, 1 / 5, 1 / 5, 1 / 5]}>
        <Avatar src={avatar ?? ''} />
      </Box>
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
`

export default AvatarSettings
