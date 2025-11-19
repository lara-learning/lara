import { SecondaryButton } from './button'
import strings from '../locales/localization'
import React from 'react'
import {
  useAdminMarkUserForDeleteMutation,
  useAdminUnmarkUserForDeleteMutation,
  useTrainerMarkUserForDeleteMutation,
  useTrainerUnmarkUserForDeleteMutation,
} from '../graphql'
interface UseDeleteActionsProps {
  //id = routesId
  id: string | undefined
  currentUserId: string | undefined
}

interface MutationVariables {
  variables: {
    id: string
  }
}

export const useDeleteActions = ({ currentUserId, id }: UseDeleteActionsProps) => {
  const vars = { variables: { id: id ?? '' } }

  const [markForDeleteAdmin, { loading: deleteLoadingAdmin }] = useTrainerMarkUserForDeleteMutation()
  const [unmarkDeleteAdmin, { loading: undeleteLoadingAdmin }] = useTrainerUnmarkUserForDeleteMutation()
  const [markForDeleteTrainer, { loading: deleteLoadingTrainer }] = useAdminMarkUserForDeleteMutation()
  const [unmarkDeleteTrainer, { loading: undeleteLoadingTrainer }] = useAdminUnmarkUserForDeleteMutation()

  const isTrainer = currentUserId === '456'
  const isAdmin = currentUserId === '789'

  const deleteActionLoading = isTrainer
    ? deleteLoadingTrainer || undeleteLoadingTrainer
    : deleteLoadingAdmin || undeleteLoadingAdmin

  const [showDeletionModal, setShowDeletionModal] = React.useState(false)

  const toggleDeletionModal = () => {
    setShowDeletionModal(!showDeletionModal)
  }

  const selectQueryForType = (vars: MutationVariables) => {
    if (isTrainer) {
      unmarkDeleteTrainer(vars)
    } else if (isAdmin) {
      unmarkDeleteAdmin(vars)
    }
  }

  const renderDeleteAction = (deleteAt?: string) => {
    if (currentUserId === id) return <></>
    if (deleteAt) {
      return (
        <SecondaryButton disabled={deleteActionLoading} onClick={() => selectQueryForType(vars)}>
          {strings.unmarkDelete}
        </SecondaryButton>
      )
    }

    return (
      <SecondaryButton danger disabled={deleteActionLoading} onClick={() => toggleDeletionModal()}>
        {strings.markDelete}
      </SecondaryButton>
    )
  }

  return {
    renderDeleteAction,
    toggleDeletionModal,
    showDeletionModal,
    markForDeleteTrainer,
    markForDeleteAdmin,
  }
}
