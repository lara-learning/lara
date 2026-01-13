import React from 'react'
import { useParams } from 'react-router'

import { EditUserLayout } from '@lara/components'

import { EditTraineeContent } from '../components/edit-trainee-content'
import Loader from '../components/loader'
import NavigationButtonLink from '../components/navigation-button-link'
import { useUserPageQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { useDeleteActions } from '../components/render-delete-action'
import { EditAdmin } from '../components/edit-admin-content'
import { EditTrainer } from '../components/edit-trainer-content'
import { DeletionModal } from '../components/deletion-modal'

type AdminEditUserPageParams = {
  id: string
}

export const AdminEditUserPage: React.FunctionComponent = () => {
  const { id } = useParams<AdminEditUserPageParams>()
  const vars = { variables: { id: id ?? '' } }
  const { data, loading } = useUserPageQuery(vars)

  const { renderDeleteAction, showDeletionModal, toggleDeletionModal, markForDeleteAdmin } = useDeleteActions({
    currentUser: data?.currentUser ?? undefined,
    id: id ?? '',
  })

  const currentUser = data?.currentUser
  if (!currentUser) return null

  return (
    <Template type="Main">
      {loading && <Loader />}
      {/* Edit Trainee page */}
      {!loading && data?.companies && data?.getUser?.__typename === 'Trainee' && (
        <EditUserLayout
          backButton={
            <NavigationButtonLink
              label={strings.back}
              to="/trainees"
              icon="ChevronLeft"
              isLeft
              iconColor="iconLightGrey"
            />
          }
          content={<EditTraineeContent trainee={data.getUser} companies={data.companies} />}
          actions={renderDeleteAction(data.getUser.deleteAt)}
        />
      )}

      {/* Edit Trainer page */}
      {!loading && data?.getUser?.__typename === 'Trainer' && (
        <EditUserLayout
          backButton={
            <NavigationButtonLink
              label={strings.back}
              to="/trainer"
              icon="ChevronLeft"
              isLeft
              iconColor="iconLightGrey"
            />
          }
          content={<EditTrainer trainer={data.getUser} />}
          actions={renderDeleteAction(data.getUser.deleteAt)}
        />
      )}

      {/* Edit Admin page */}
      {!loading && data?.getUser?.__typename === 'Admin' && (
        <EditUserLayout
          backButton={
            <NavigationButtonLink
              label={strings.back}
              to="/admins"
              icon="ChevronLeft"
              isLeft
              iconColor="iconLightGrey"
            />
          }
          content={<EditAdmin admin={data.getUser} disableEmail={currentUser.id === id} />}
          actions={renderDeleteAction(data.getUser.deleteAt)}
        />
      )}

      {!loading && (
        <DeletionModal
          show={showDeletionModal}
          onClose={toggleDeletionModal}
          onConfirm={() => markForDeleteAdmin(vars)}
          userName={`${data?.getUser?.firstName} ${data?.getUser?.lastName}`}
        />
      )}
    </Template>
  )
}
