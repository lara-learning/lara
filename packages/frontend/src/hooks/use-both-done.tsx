import { useCallback, useEffect, useState } from 'react'
import { FazitUpdateMutation, GetFazitDocument, FazitUpdateMutationVariables } from '../graphql'
import { MutationFunctionOptions, FetchResult } from '@apollo/client'

interface UseBothDoneProps {
  fazit: {
    mentorDone: boolean
    traineeDone: boolean
  } | null
  currentRole: 'Mentor' | 'Trainee'
  paperId: string
  localContent: string
  localVersion: number
  currentUserId: string
  updateFazit: (
    options: MutationFunctionOptions<FazitUpdateMutation, FazitUpdateMutationVariables>
  ) => Promise<FetchResult<FazitUpdateMutation>>
}

export function useBothDone({
  fazit,
  currentRole,
  paperId,
  localContent,
  localVersion,
  currentUserId,
  updateFazit,
}: UseBothDoneProps) {
  // Local state for optimistic UI
  const [mentorDone, setMentorDone] = useState(fazit?.mentorDone ?? false)
  const [traineeDone, setTraineeDone] = useState(fazit?.traineeDone ?? false)

  // Sync local state with server whenever fazit changes
  useEffect(() => {
    if (fazit) {
      setMentorDone(fazit.mentorDone)
      setTraineeDone(fazit.traineeDone)
    }
  }, [fazit])

  const bothDone = mentorDone && traineeDone
  const currentRoleDone = currentRole === 'Mentor' ? mentorDone : traineeDone
  const otherRoleDone = currentRole === 'Mentor' ? traineeDone : mentorDone

  const handleToggleDone = useCallback(async () => {
    const newValue = !currentRoleDone

    const updatedMentorDone = currentRole === 'Mentor' ? newValue : mentorDone
    const updatedTraineeDone = currentRole === 'Trainee' ? newValue : traineeDone

    // Optimistic local update
    setMentorDone(updatedMentorDone)
    setTraineeDone(updatedTraineeDone)

    // Log after computing new state
    console.log('Checkbox clicked (after update):', {
      currentRole,
      updatedMentorDone,
      updatedTraineeDone,
      bothDoneAfterClick: updatedMentorDone && updatedTraineeDone,
    })

    // Send mutation
    await updateFazit({
      variables: {
        id: paperId,
        content: localContent,
        version: localVersion + 1,
        mentorDone: updatedMentorDone,
        traineeDone: updatedTraineeDone,
        cursorPosition: { position: 0, owner: currentUserId },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateFazit: {
          __typename: 'FazitUpdateResponse',
          success: true,
          newFazit: {
            __typename: 'Fazit',
            id: paperId,
            content: localContent,
            version: localVersion + 1,
            mentorDone: updatedMentorDone,
            traineeDone: updatedTraineeDone,
            cursorPositions: [],
          },
        },
      },
      update: (cache, { data }) => {
        if (!data?.updateFazit?.newFazit) return
        cache.writeQuery({
          query: GetFazitDocument,
          variables: { id: paperId },
          data: { getFazit: data.updateFazit.newFazit },
        })
      },
    })
  }, [
    currentRole,
    currentRoleDone,
    mentorDone,
    traineeDone,
    paperId,
    localContent,
    localVersion,
    currentUserId,
    updateFazit,
  ])

  return { bothDone, currentRoleDone, otherRoleDone, handleToggleDone }
}
