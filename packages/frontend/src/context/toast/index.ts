import React from 'react'

import { Icons } from '@lara/components'

export type ToastType = 'error' | 'warning' | 'success'

export interface ToastInput {
  title?: string
  text: string
  type: ToastType
  icon?: keyof typeof Icons
}

export interface Toast extends ToastInput {
  id: string
  visible: boolean
}

export interface ToastContextValue {
  readonly toasts: Toast[]
  readonly addToast: (toast: ToastInput) => void
  readonly removeToast: (toast: Toast) => void
}

export const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)
