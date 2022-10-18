import React, { useCallback, useState } from 'react'

import { StyledSuggestionItem, StyledSuggestionList, StyledSuggestionWrapper } from '@lara/components'

import { useSuggestionsDataQuery } from '../graphql'
import { useFocusState } from '../hooks/use-focus-state'

interface SuggestionProps {
  inputRef: React.RefObject<HTMLTextAreaElement>
  submitSuggestion: (text: string) => void
}

// Maximum number suggestions
const SUGGESTION_COUNT = 5

const Suggestions: React.FC<SuggestionProps> = ({ submitSuggestion, inputRef }) => {
  const { loading, data } = useSuggestionsDataQuery()

  const inputFocused = useFocusState(inputRef)

  const [visible, setVisible] = React.useState(true)
  const [waitingForBlur, setWaitingForBlur] = React.useState('')

  // Ref states so the handleKeyDown handler can use the state
  const [focusIndex, setFocusIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleInput = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    // update suggestions on textInput change
    const input = inputRef.current.value.toLowerCase()

    const newSuggestionState =
      data?.suggestions
        .filter((suggestion) => input.replace(/\s/g, '') !== '' && suggestion.toLowerCase().indexOf(input) > -1)
        .slice(0, SUGGESTION_COUNT) ?? []

    setSuggestions(newSuggestionState)

    // Reduce focusIndex if less suggestions are valid
    // then before or only one suggestion is valid
    if (focusIndex >= newSuggestionState.length || newSuggestionState.length === 1) {
      setFocusIndex(newSuggestionState.length - 1)
    }
  }, [data?.suggestions, focusIndex, inputRef])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { current: input } = inputRef

      switch (event.key) {
        case 'Enter':
          // submit the suggestion if shift isn't pressed
          if (!event.shiftKey && focusIndex > -1) {
            setWaitingForBlur(suggestions[focusIndex])
          }
          break
        case 'ArrowUp':
          // move focus up if any suggestion is selected
          if (focusIndex >= 0) {
            event.preventDefault()
            setFocusIndex(focusIndex - 1)
          }
          break
        case 'ArrowDown': {
          if (!input) {
            return
          }

          // move down if cursor is in bottom most line of the textArea
          const cursorRow = input.value.substr(0, input.selectionStart).split('\n').length
          const rows = input.value.split('\n').length

          if (cursorRow === rows && focusIndex < suggestions.length - 1) {
            event.preventDefault()
            setFocusIndex(focusIndex + 1)
          }
          break
        }
        case 'Escape':
          // hide suggestions on escape
          setVisible(false)
          break
      }
    },
    [setWaitingForBlur, focusIndex, inputRef, suggestions]
  )

  React.useEffect(() => {
    // inject keydown handler into given ref element
    const { current } = inputRef

    if (current && !loading) {
      current.addEventListener('keydown', handleKeyDown)
      current.addEventListener('input', handleInput)
    }

    return () => {
      if (current && !loading) {
        current.removeEventListener('keydown', handleKeyDown)
        current.removeEventListener('input', handleInput)
      }
    }
  }, [loading, handleKeyDown, handleInput, inputRef])

  React.useEffect(() => {
    // only show suggestions if input is focused
    setVisible(inputFocused)

    // clear leftover suggestions from last input
    if (inputFocused) {
      setSuggestions([])
    }

    // This is nessecary so the blur event doesn't interfere
    // with the focus event on the timeInput field
    if (waitingForBlur) {
      submitSuggestion(waitingForBlur)
      setWaitingForBlur('')

      // clear the state
      setFocusIndex(-1)
      setSuggestions([])
    }
  }, [inputFocused, submitSuggestion, waitingForBlur])

  return (
    <StyledSuggestionWrapper>
      <StyledSuggestionList active={visible}>
        {suggestions.map((suggestion, index) => {
          if (!inputRef.current) {
            return
          }

          const input = inputRef.current.value.toLowerCase()
          const matchIndex = suggestion.toLowerCase().indexOf(input)

          return (
            <StyledSuggestionItem key={index} onMouseDown={() => setWaitingForBlur(suggestion)}>
              {suggestion.substr(0, matchIndex)}
              <b>{suggestion.substr(matchIndex, input.length)}</b>
              {suggestion.substr(matchIndex + input.length)}
            </StyledSuggestionItem>
          )
        })}
      </StyledSuggestionList>
    </StyledSuggestionWrapper>
  )
}

export default Suggestions
