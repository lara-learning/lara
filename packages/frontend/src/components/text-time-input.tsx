import React, { useState } from 'react'

import { StyledEntryContainer, StyledInputTextArea, StyledTextTimeInputWrapper, StyledTime } from '@lara/components'

import { Entry, EntryInput } from '../graphql'
import TimeConversion from '../helper/time-conversion'
import { useFocusState } from '../hooks/use-focus-state'
import strings from '../locales/localization'
import Suggestions from './suggestions'
import { useValidationHelper } from '../helper/validation-helper'

interface TextTimeInputProps {
  onSave: (entry: EntryInput) => void
  onDelete?: () => void
  clearOnSave?: boolean
  entry?: Pick<Entry, 'time' | 'text'>
  disabled?: boolean
  autoFocus?: boolean
}

const TextTimeInput: React.FC<TextTimeInputProps> = ({ entry, disabled, onDelete, onSave, clearOnSave, autoFocus }) => {
  const { validateTime } = useValidationHelper()

  const [timeInputValue, setTimeInputValue] = useState(entry ? TimeConversion.minutesToString(entry.time) : '')

  const timeInput = React.useRef<HTMLInputElement>(null)
  const textInput = React.useRef<HTMLTextAreaElement>(null)

  const textInputFocus = useFocusState(textInput)
  const timeInputFocus = useFocusState(timeInput)

  const textKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      timeInput.current?.focus()
    } else if (
      event.key === 'Backspace' &&
      onDelete &&
      textInput.current?.value === '' &&
      timeInput.current?.value === ''
    ) {
      onDelete()
    }
  }

  const timeKeyDown = (event: React.KeyboardEvent) => {
    if (!timeInput.current || !textInput.current) {
      return
    }

    if (event.key === 'Enter') {
      timeInput.current.blur()
    } else if (event.key === 'Backspace' && timeInput.current.value === '') {
      textInput.current.focus()
      setCursorToEnd(textInput.current)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!timeInput.current || !textInput.current) {
        return
      }

      if (
        textInput.current.value !== '' &&
        timeInput.current.value !== '' &&
        document.activeElement !== textInput.current &&
        document.activeElement !== timeInput.current
      ) {
        submit()

        if (clearOnSave) {
          setTimeInputValue('')
          timeInput.current.value = ''
          textInput.current.value = ''
        }

        if (textInput.current) {
          textInput.current.focus()
          resizeInput()
        }
      }
    })
  }

  const setCursorToEnd = (input: HTMLInputElement | HTMLTextAreaElement) => {
    if (input.setSelectionRange) {
      const pos = input.value.length
      input.setSelectionRange(pos, pos)
    }
  }

  const submit = () => {
    if (!timeInput.current || !textInput.current) {
      return
    }

    const time: number = validateTime(timeInput.current.value)
      ? TimeConversion.stringToMinutes(timeInput.current.value)
      : 0

    onSave({
      text: textInput.current.value,
      time,
    })
  }

  React.useEffect(() => {
    if (!timeInput.current || !textInput.current) {
      return
    }

    if (autoFocus) {
      textInput.current.focus()
      setCursorToEnd(textInput.current)
    }
  }, [autoFocus])

  const acceptSuggestion = (inputText: string) => {
    if (!timeInput.current || !textInput.current) {
      return
    }

    textInput.current.value = inputText
    timeInput.current.focus()
    resizeInput()
  }

  const resizeInput = () => {
    if (!textInput.current) {
      return
    }

    const { scrollHeight, clientHeight, style } = textInput.current

    if (!textInput.current.value) {
      style.height = 'auto'
    }

    if (scrollHeight > clientHeight) {
      style.height = scrollHeight.toString() + 'px'
    }
  }

  const textDefaultValue = entry ? entry.text : ''

  const handleTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regEx = /^\d{0,2}:?\d{0,2}$/

    if (regEx.test(event.target.value)) {
      setTimeInputValue(event.target.value)
    }
  }

  return (
    <>
      <StyledEntryContainer>
        <StyledTextTimeInputWrapper focused={textInputFocus || timeInputFocus}>
          <StyledInputTextArea
            disabled={disabled}
            ref={textInput}
            defaultValue={textDefaultValue}
            onInput={resizeInput}
            onFocus={resizeInput}
            onKeyDown={textKeyDown}
            onBlur={handleBlur}
            rows={textInput.current ? textInput.current.value.split('\n').length : 1}
            placeholder={strings.report.textPlaceholder}
          />
          <StyledTime
            disabled={disabled}
            ref={timeInput}
            onKeyDown={timeKeyDown}
            onBlur={handleBlur}
            placeholder="0:00"
            value={timeInputValue}
            onChange={handleTimeInputChange}
          />
        </StyledTextTimeInputWrapper>
      </StyledEntryContainer>
      <Suggestions submitSuggestion={acceptSuggestion} inputRef={textInput} />
    </>
  )
}

export default TextTimeInput
