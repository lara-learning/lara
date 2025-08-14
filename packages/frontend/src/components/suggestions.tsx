import React, { useCallback, useState } from 'react'

import { StyledSuggestionItem, StyledSuggestionList, StyledSuggestionWrapper } from '@lara/components'

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
  const [waitingForBlurOnTimeSuggestion, setWaitingForBlurOnTimeSuggestion] = React.useState<string>('')

  // Ref states so the handleKeyDown handler can use the state
  const [focusIndex, setFocusIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsWithTimes, setSuggestionsWithTimes] = useState<
    Array<{
      text: string
      time: string
    }>
  >([])
  const [suggestionTime, setSuggestionTime] = useState<string[]>([])

  const handleInput = useCallback(() => {
    if (!inputRef.current) {
      return
    }

    // update suggestions on textInput change
    const input = inputRef.current.value.toLowerCase()

    console.log(data?.suggestions, 'suggestions frontend')

    const filteredSuggestions =
      data?.suggestions
        .filter((suggestion) => input.replace(/\s/g, '') !== '' && suggestion.text.toLowerCase().indexOf(input) > -1)
        .slice(0, SUGGESTION_COUNT) ?? []

    const newSuggestionState = filteredSuggestions.map((s) => s.text)
    const suggestionTimes = filteredSuggestions.map((s) => s.time)

    console.log(suggestionTimes, 'suggestionTimes')
    console.log(newSuggestionState, 'suggestionState')

    // Single array containing both text and time
    const suggestionsWithTimes = filteredSuggestions.map((s) => ({
      text: s.text,
      time: s.time,
    }))

    setSuggestionsWithTimes(suggestionsWithTimes)

    setSuggestionTime(suggestionTimes)
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
      submitTextSuggestion(waitingForBlur)
      setWaitingForBlur('')

      // clear the state
      setFocusIndex(-1)
      setSuggestions([])
    }

    if (waitingForBlurOnTimeSuggestion) {
      submitTimeSuggestion(waitingForBlurOnTimeSuggestion)
      setWaitingForBlurOnTimeSuggestion('')

      // clear the state
      setFocusIndex(-1)
      setSuggestionTime([])
    }
  }, [inputFocused, submitTextSuggestion, submitTimeSuggestion, waitingForBlur, waitingForBlurOnTimeSuggestion])

  return (
    <StyledSuggestionWrapper>
      <StyledSuggestionList active={visible}>
        {suggestionsWithTimes.map((suggestion, index) => {
          console.log('rendered suggestions')
          if (!inputRef.current) {
            return
          }

          const input = inputRef.current.value.toLowerCase()
          const matchIndex = suggestion.text.toLowerCase().indexOf(input)

          return (
            <>
              <StyledSuggestionItem key={index} onMouseDown={() => setWaitingForBlur(suggestion.text)}>
                {suggestion.text.substr(0, matchIndex)}
                <b>{suggestion.text.substr(matchIndex, input.length)}</b>

                {suggestion.text.substr(matchIndex + input.length)}
              </StyledSuggestionItem>
              <StyledSuggestionItem onMouseDown={() => setWaitingForBlurOnTimeSuggestion(suggestion.time)}>
                <p>{suggestionTime}</p>
              </StyledSuggestionItem>
            </>
          )
        })}
      </StyledSuggestionList>
    </StyledSuggestionWrapper>
  )
}

export default Suggestions
