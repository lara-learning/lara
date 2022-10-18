import React from 'react'
import FocusLock from 'react-focus-lock'

import { ModalLayout, ModelStylingProps } from '@lara/components'

import strings from '../locales/localization'
import { PrimaryButton } from './button'

interface ModalProps extends ModelStylingProps {
  handleClose: () => void
  children: React.ReactNode
  customClose: boolean
}

const Modal: React.FunctionComponent<ModalProps> = ({ children, customClose, handleClose, show, ...rest }) => {
  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && show) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => document.removeEventListener('keydown', handleKeydown)
  }, [handleClose, show])

  return (
    <FocusLock>
      <ModalLayout
        {...rest}
        show={show}
        button={
          <>{!customClose && <PrimaryButton onClick={handleClose}>{strings.modal.defaultClose}</PrimaryButton>}</>
        }
      >
        {children}
      </ModalLayout>
    </FocusLock>
  )
}

export default Modal
