import React, { useRef } from 'react'

import { Toast, ToastContext, ToastInput } from './'

export const ToastContextProvider: React.FunctionComponent = ({ children }) => {
  const [dangerousToasts, setDangerousToasts] = React.useState<Toast[]>([])

  const toasts = React.useRef<Toast[]>([])

  const timeouts = useRef<Record<string, number>>({})

  // change the ref and the state simultaneously
  const updateToasts = (newToasts: Toast[]) => {
    toasts.current = newToasts
    setDangerousToasts(newToasts)
  }

  const addToast = (input: ToastInput) => {
    const toast: Toast = { id: Math.random().toString(36).substring(2, 9), visible: true, ...input }

    // timout to automatically hide the toast after 7 seconds
    const visibleTimer = window.setTimeout(() => {
      if (!toast.visible) {
        return
      }

      removeToast(toast)
    }, 7000)

    // save the timouts for cleanup in removeToast function
    timeouts.current[toast.id] = visibleTimer

    updateToasts([...toasts.current, toast])
  }

  const removeToast = (toast: Toast) => {
    // toast already disappeared
    if (!toast.visible) {
      return
    }

    // remove the timeout that automatically hides the toast
    const timeout = timeouts.current[toast.id]
    if (timeout) {
      clearTimeout(timeout)
    }

    // get index of the toast
    const toastIndex = toasts.current.findIndex((t) => t.id === toast.id)

    // unmount the toast
    updateToasts([...toasts.current.slice(0, toastIndex), ...toasts.current.slice(toastIndex + 1)])
  }

  return (
    <ToastContext.Provider value={{ toasts: dangerousToasts, addToast, removeToast }}>{children}</ToastContext.Provider>
  )
}
