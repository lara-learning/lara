import React from 'react'
import { H1, Paragraph, Spacings, Flex, Box } from '@lara/components'
import { PrimaryButton, SecondaryButton } from './button'
import Modal from './modal'
import { useToastContext } from '../hooks/use-toast-context'
import { GraphQLError } from 'graphql'
import strings from '../locales/localization'

interface DeletionModalProps {
  show: boolean
  onClose: () => void
  onConfirm: () => Promise<unknown>
  userName: string
  loading?: boolean
}

export const DeletionModal: React.FC<DeletionModalProps> = ({
  show,
  onClose,
  onConfirm,
  userName,
  loading = false,
}) => {
  const { addToast } = useToastContext()

  const handleConfirm = () => {
    onConfirm()
      .then(() => {
        onClose()
        addToast({
          icon: 'PersonAttention',
          title: strings.userDelete.title,
          text: strings.userDelete.description,
          type: 'error',
        })
      })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }

  return (
    <Modal show={show} customClose handleClose={onClose}>
      <H1 noMargin>{strings.formatString(strings.deleteTrainer.title, userName)}</H1>
      <Paragraph margin={`${Spacings.l}`} color="darkFont">
        {strings.deleteTrainer.description}
      </Paragraph>
      <Flex justifyContent="flex-end">
        <Box pr={'1'}>
          <SecondaryButton ghost onClick={onClose} disabled={loading}>
            {strings.cancel}
          </SecondaryButton>
        </Box>
        <Box pl={'1'}>
          <PrimaryButton danger onClick={handleConfirm}>
            {strings.deactivate}
          </PrimaryButton>
        </Box>
      </Flex>
    </Modal>
  )
}
