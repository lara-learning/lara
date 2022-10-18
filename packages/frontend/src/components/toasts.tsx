import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import {
  BorderRadii,
  DefaultTheme,
  H2,
  IconName,
  Paragraph,
  Spacer,
  Spacings,
  StyledIcon,
  StyledIconWrapper,
  StyledToast,
  StyledToastHeader,
  StyledToastWrapper,
} from '@lara/components'

import { Toast } from '../context/toast'
import { useToastContext } from '../hooks/use-toast-context'
import { CloseButton } from './close-button'

interface ToastBarProps {
  toast: Toast
}

export const ToastExitAnimationTime = 700

const ToastBar: React.FunctionComponent<ToastBarProps> = ({ toast }) => {
  const { removeToast } = useToastContext()

  let icon: IconName
  let color: keyof DefaultTheme
  let background: keyof DefaultTheme

  switch (toast.type) {
    case 'error':
      icon = toast.icon ?? 'Error'
      color = 'redDark'
      background = 'errorNotificationBackgroundRed'
      break
    case 'success':
      icon = toast.icon ?? 'Success'
      color = 'greenDark'
      background = 'successNotificationBackgroundGreen'
      break
    case 'warning':
      icon = toast.icon ?? 'Bulb'
      background = 'warningYellow'
      color = 'warningYellow'
      break
  }

  return (
    <StyledToast color={'surface'}>
      <StyledIconWrapper background={background}>
        {icon && <StyledIcon marginLeft={'s'} marginRight={'s'} name={icon} size="24px" color={color} />}
      </StyledIconWrapper>
      <div>
        <StyledToastHeader>
          <H2 noMargin>{toast.title}</H2>
          <CloseButton onClick={() => removeToast(toast)} />
        </StyledToastHeader>
        <Spacer top={'xs'}>
          <Paragraph color={'darkFont'} noMargin>
            {toast.text}
          </Paragraph>
        </Spacer>
      </div>
    </StyledToast>
  )
}

export const Toasts: React.FunctionComponent = () => {
  const { toasts } = useToastContext()

  return (
    <StyledToastWrapper>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            animate={{ y: 0 }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
            initial={{
              y: 200,
              overflow: 'hidden',
              marginTop: Spacings.m,
              boxShadow: '0 7px 14px 0 rgba(30, 39, 49, 0.1)',
              borderRadius: BorderRadii.xxs,
            }}
            exit={{ opacity: 0, transition: { duration: ToastExitAnimationTime / 1000 } }}
          >
            <ToastBar toast={toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </StyledToastWrapper>
  )
}
