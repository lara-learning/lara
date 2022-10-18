import React from 'react'

import { ToastContext, ToastContextValue } from '../context/toast'

export const useToastContext = (): ToastContextValue => {
  const toastContext = React.useContext(ToastContext)

  if (!toastContext) {
    throw new Error('No toast context value was provided.')
  }

  return toastContext
}
