import React from 'react'

export const useFocusState = (ref: React.RefObject<HTMLElement>): boolean => {
  const [state, setState] = React.useState(false)

  const handleFocus = () => setState(true)
  const handleBlur = () => setState(false)

  React.useEffect(() => {
    const currentRef = ref.current

    if (currentRef) {
      currentRef.addEventListener('focus', handleFocus)
      currentRef.addEventListener('blur', handleBlur)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('focus', handleFocus)
        currentRef.removeEventListener('blur', handleBlur)
      }
    }
  }, [ref])

  return state
}
