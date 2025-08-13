import React from 'react'
import { useParams } from 'react-router'

import { EditUserLayout, H1, Paragraph, Spacings, Flex, Box } from '@lara/components'

import { PrimaryButton, SecondaryButton } from '../components/button'
import { EditTraineeContent } from '../components/edit-trainee-content'
import { EditTrainer } from '../components/edit-trainer-content'
import Loader from '../components/loader'
import NavigationButtonLink from '../components/navigation-button-link'
import { useMarkUserForDeleteMutation, useUnmarkUserForDeleteMutation, useUserPageQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import Modal from '../components/modal'
import { useToastContext } from '../hooks/use-toast-context'

type AdminEditUserPageParams = {
  id: string
}

export const AdminEditUserPage: React.FunctionComponent = () => {
  const { id } = useParams<AdminEditUserPageParams>()
  const vars = { variables: { id: id ?? '' } }
  const { data, loading } = useUserPageQuery(vars)

  const [markForDelete, { loading: deleteLoading }] = useMarkUserForDeleteMutation()
  const [unmarkDelete, { loading: undeleteLoading }] = useUnmarkUserForDeleteMutation()

  const deleteActionLoading = deleteLoading || undeleteLoading
  const [showDeletionModal, setShowDeletionModal] = React.useState(false)
  const { addToast } = useToastContext()

  const toggleDeletionModal = () => {
    setShowDeletionModal(!showDeletionModal)
  }

  const renderDeleteAction = (deleteAt?: string) => {
    if (deleteAt) {
      return (
        <SecondaryButton disabled={deleteActionLoading} onClick={() => unmarkDelete(vars)}>
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

      {!loading && (
        <Modal show={showDeletionModal} customClose handleClose={toggleDeletionModal}>
          <H1 noMargin>
            {strings.formatString(
              strings.deleteTrainer.title,
              `${data?.getUser?.firstName} ${data?.getUser?.lastName}`
            )}
          </H1>
          <Paragraph margin={`${Spacings.l}`} color="darkFont">
            {strings.deleteTrainer.description}
          </Paragraph>
          <Flex justifyContent="flex-end">
            <Box pr={'1'}>
              <SecondaryButton
                ghost
                onClick={() => {
                  toggleDeletionModal()
                }}
              >
                {strings.cancel}
              </SecondaryButton>
            </Box>
            <Box pl={'1'}>
              <PrimaryButton
                danger
                onClick={() => {
                  markForDelete(vars).then(() => {
                    toggleDeletionModal()
                    addToast({
                      icon: 'PersonAttention',
                      title: strings.userDelete.title,
                      text: strings.userDelete.description,
                      type: 'error',
                    })
                  })
                }}
              >
                {strings.deactivate}
              </PrimaryButton>
            </Box>
          </Flex>
        </Modal>
      )}
    </Template>
  )
}
