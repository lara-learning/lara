import React from 'react'

import { StyledEntryContainer, StyledInputTextArea, StyledTextTimeInputWrapper } from '@lara/components'

import {AnswerPaperInput, PaperFormData} from '../graphql'
import strings from '../locales/localization'
import {useFocusState} from "../hooks/use-focus-state";

interface PaperTextInputProps {
  onSave: (paperInput: AnswerPaperInput) => any
  onDelete?: () => any
  clearOnSave?: boolean
  entry: PaperFormData
  disabled?: boolean
  autoFocus?: boolean
}

const PaperTextInput: React.FC<PaperTextInputProps> = ({ entry, disabled, onDelete, onSave, clearOnSave, autoFocus }) => {
  const textInput = React.useRef<HTMLTextAreaElement>(null)
  const textInputFocus = useFocusState(textInput)

  const textKeyDown = (event: React.KeyboardEvent) => {
    if (!textInput.current) {
      return
    }
    else if (event.key === 'Enter' && !event.shiftKey) {
      textInput.current.blur()
    }
    else if(event.key === 'Backspace' &&
      onDelete &&
      textInput.current?.value === '') {
        onDelete()
    }
    else if (event.key === 'Backspace' && textInput.current?.value === '') {
        textInput.current?.focus()
        setCursorToEnd(textInput.current)
      }
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!textInput.current) {
        return
      }

      if (
        textInput.current.value !== '' &&
        document.activeElement !== textInput.current
      ) {
        submit()

        if (clearOnSave) {
          textInput.current.value = ''
        }

        if (textInput.current) {
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
    if (!textInput.current) {
      return
    }
    onSave({
      answer: textInput.current.value,
      question: entry.question,
      id: entry.id,
      hint: entry.hint ? entry.hint : '',
    })
  }

  React.useEffect(() => {
    if (!textInput.current) {
      return
    }

    if (autoFocus) {
      textInput.current.focus()
      setCursorToEnd(textInput.current)
    }
  }, [autoFocus])

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

  const textDefaultValue = entry ? entry.answer : ''

  return (
    <>
      <StyledEntryContainer>
        <StyledTextTimeInputWrapper focused={textInputFocus}>
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
        </StyledTextTimeInputWrapper>
      </StyledEntryContainer>
    </>
  )
}

export default PaperTextInput
