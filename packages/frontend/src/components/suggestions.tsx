import React, { useCallback, useState } from 'react'

import { Spacings, StyledSuggestionItem, StyledSuggestionList, StyledSuggestionWrapper } from '@lara/components'

import { useSuggestionsDataQuery } from '../graphql'
import { useFocusState } from '../hooks/use-focus-state'

interface SuggestionProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  submitTextSuggestion: (text: string) => void
  submitTimeSuggestion: (text: string) => void
}

// Maximum number suggestions
const SUGGESTION_COUNT = 5

const Suggestions: React.FC<SuggestionProps> = ({ submitTextSuggestion, submitTimeSuggestion, inputRef }) => {
  const { loading, data } = useSuggestionsDataQuery()

  const inputFocused = useFocusState(inputRef)

  const [visible, setVisible] = React.useState(true)
  const [waitingForBlur, setWaitingForBlur] = React.useState('')
  const [waitingForBlurTimeSuggestion, setWaitingForBlurTimeSuggestion] = React.useState('')

  // Ref states so the handleKeyDown handler can use the state
  const [focusIndex, setFocusIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsWithTimes, setSuggestionsWithTimes] = useState<
    Array<{
      text: string
      time: string
    }>
  >([])

  const handleInput = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    // update suggestions on textInput change
    const input = inputRef.current.value.toLowerCase()

    const filteredSuggestions =
      data?.suggestions
        .filter((suggestion) => input.replace(/\s/g, '') !== '' && suggestion.text.toLowerCase().indexOf(input) > -1)
        .slice(0, SUGGESTION_COUNT) ?? []

    const newSuggestionState = filteredSuggestions.map((s) => s.text)

    // Single array containing both text and time
    const suggestionsWithTimes = filteredSuggestions.map((s) => ({
      text: s.text,
      time: s.time,
    }))

    setSuggestionsWithTimes(suggestionsWithTimes)

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
            event.preventDefault()
            const suggestionsTextWithTime = suggestionsWithTimes[focusIndex]
            if (suggestionsTextWithTime) {
              setWaitingForBlur(suggestionsTextWithTime.text)
              setWaitingForBlurTimeSuggestion(suggestionsTextWithTime.time)
            } else {
              setWaitingForBlur(suggestions[focusIndex])
            }
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
    [setWaitingForBlur, focusIndex, inputRef, suggestions, suggestionsWithTimes]
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
      submitTextSuggestion(waitingForBlur)
      setWaitingForBlur('')

      // clear the state
      setFocusIndex(-1)
      setSuggestions([])
    }

    if (waitingForBlurTimeSuggestion) {
      submitTimeSuggestion(waitingForBlurTimeSuggestion)
      setWaitingForBlurTimeSuggestion('')

      // clear the state
      setFocusIndex(-1)
      setSuggestions([])
    }
  }, [inputFocused, submitTextSuggestion, submitTimeSuggestion, waitingForBlur, waitingForBlurTimeSuggestion])

  return (
    <StyledSuggestionWrapper>
      <StyledSuggestionList active={visible}>
        {suggestionsWithTimes.map((suggestion, index) => {
          if (!inputRef.current) {
            return
          }

          return (
            <>
              <StyledSuggestionItem
                key={index}
                onMouseDown={() => {
                  setWaitingForBlur(suggestion.text)
                  setWaitingForBlurTimeSuggestion(suggestion.time)
                }}
              >
                <b>{suggestion.text}</b>
                <b style={{ marginLeft: Spacings.s }}>{suggestion.time}</b>
              </StyledSuggestionItem>
            </>
          )
        })}
      </StyledSuggestionList>
    </StyledSuggestionWrapper>
  )
}

export default Suggestions
