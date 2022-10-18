import { useEffect, useRef } from 'react'
import { FormState } from 'react-hook-form'

import strings from '../locales/localization'
import { useToastContext } from './use-toast-context'

export const useFormToasts = <T extends Record<string, any>>(formState: FormState<T>): void => {
  const { errors } = formState

  const errorKey = useRef('')
  const errorMessage = useRef('')

  const { addToast } = useToastContext()

  useEffect(() => {
    const errorEntries = Object.entries(errors)

    if (errorEntries.length === 0) {
      return
    }

    // find the error that for the input that is currently focuseds
    const errorEntry = errorEntries.find(([_key, value]) => value && document.activeElement === value.ref)

    // fallback to the first error
    const [key, error] = errorEntry ?? errorEntries[0]

    // only add a toast when there is a message to display and the previous toasts either
    // had a different message or was for a different input
    const isDifferentInput = key !== errorKey.current
    const isDifferentMessage = error && error.message !== errorMessage.current

    if (error && error.message && (isDifferentInput || isDifferentMessage)) {
      // save the input and message for next form update
      errorKey.current = key
      errorMessage.current = error.message.toString()

      addToast({ title: strings.errors.error, text: error.message.toString(), type: 'error', icon: 'Error' })
    }

    // we don't want exhaustive deps cause calling addToast will change the
    // addToast identity and cause an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])
}
