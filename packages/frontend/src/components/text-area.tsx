import React from 'react'

import { StyledInputTextArea } from '@lara/components'

interface TextAreaProps {
  onInput?: (input: React.FormEvent<HTMLTextAreaElement>) => void
  onBlur?: (input: React.FormEvent<HTMLTextAreaElement>) => void
  onFocus?: (input: React.FormEvent<HTMLTextAreaElement>) => void
  inputRef?: (ref: HTMLTextAreaElement | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  defaultValue?: string
}

export const TextArea: React.FC<TextAreaProps> = ({
  disabled,
  inputRef,
  placeholder,
  defaultValue,
  className,
  onInput,
  onFocus,
  onBlur,
}) => {
  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight(event.target as HTMLTextAreaElement)
    if (onInput) {
      onInput(event)
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    adjustHeight(event.target)
    if (onFocus) {
      onFocus(event)
    }
  }

  const adjustHeight = (target: HTMLTextAreaElement) => {
    const minHeight = 77
    const outerHeight = parseInt(window.getComputedStyle(target).height, 10)
    const diff = outerHeight - target.clientHeight
    target.style.height = '0px'
    const newHeight = Math.max(minHeight, target.scrollHeight + diff).toString() + 'px'
    target.style.height = newHeight
  }

  return (
    <StyledInputTextArea
      ref={inputRef}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onFocus={handleFocus}
      onBlur={(event) => onBlur && onBlur(event)}
      onInput={handleInput}
      className={className}
    />
  )
}
