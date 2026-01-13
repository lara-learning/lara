import { SecondaryButton } from './button'
import strings from '../locales/localization'
import React from 'react'
import {
  useAdminMarkUserForDeleteMutation,
  useAdminUnmarkUserForDeleteMutation,
  UserTypeEnum,
  useTrainerMarkTraineeForDeleteMutation,
  useTrainerUnmarkTraineeForDeleteMutation,
} from '../graphql'
interface UseDeleteActionsProps {
  id: string | undefined
  currentUser:
    | { __typename?: 'Admin' | undefined; id: string }
    | { __typename?: 'Trainee' | undefined; id: string }
    | { __typename?: 'Trainer' | undefined; id: string }
    | undefined
}

interface MutationVariables {
  variables: {
    id: string
  }
}

export const useDeleteActions = ({ currentUser, id }: UseDeleteActionsProps) => {
  const vars = { variables: { id: id ?? '' } }

  const [markForDeleteAdmin, { loading: deleteLoadingAdmin }] = useAdminMarkUserForDeleteMutation()
  const [unmarkDeleteAdmin, { loading: undeleteLoadingAdmin }] = useAdminUnmarkUserForDeleteMutation()
  const [markForDeleteTrainer, { loading: deleteLoadingTrainer }] = useTrainerMarkTraineeForDeleteMutation()
  const [unmarkDeleteTrainer, { loading: undeleteLoadingTrainer }] = useTrainerUnmarkTraineeForDeleteMutation()

  const isTrainer = currentUser?.__typename === UserTypeEnum.Trainer
  const isAdmin = currentUser?.__typename === UserTypeEnum.Admin

  const deleteActionLoading = isTrainer
    ? deleteLoadingTrainer && undeleteLoadingTrainer
    : deleteLoadingAdmin && undeleteLoadingAdmin

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
    if (currentUser?.id === id) return <></>
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
