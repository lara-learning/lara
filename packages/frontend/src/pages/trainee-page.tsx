import React from 'react'
import { useParams } from 'react-router'

import { AdminCreateUserLayout, EditUserLayout, H1, Paragraph } from '@lara/components'

import Loader from '../components/loader'
import TraineeRow from '../components/trainee-row'
import { useCreateTraineeMutation, useTraineePageDataQuery, useUserPageQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { Fab } from '../components/fab'
import Modal from '../components/modal'
import { EditTraineeFormData, TraineeForm } from '../components/trainee-form'
import { useToastContext } from '../hooks/use-toast-context'
import { GraphQLError } from 'graphql'
import { DeletionModal } from '../components/DeletionModal'
import NavigationButtonLink from '../components/navigation-button-link'
import { useDeleteActions } from '../components/renderDeleteAction'

const TraineePage: React.FunctionComponent = () => {
  const { trainee } = useParams()
  const { loading, data } = useTraineePageDataQuery()
  const vars = { variables: { id: trainee ?? '' } }
  const { data: dataPageQuery, loading: pagequeryloading } = useUserPageQuery(vars)
  const [mutate] = useCreateTraineeMutation()
  const { addToast } = useToastContext()
  const [showModal, setShowModal] = React.useState(false)

  const isActive = (id: string): boolean => {
    return id === trainee
  }

  const { renderDeleteAction, showDeletionModal, toggleDeletionModal, markForDeleteTrainer } = useDeleteActions({
    currentUserId: dataPageQuery?.currentUser?.id,
    id: trainee,
  })

  const createTrainee = async (data: EditTraineeFormData) => {
    await mutate({
      variables: { input: data },
      updateQueries: {
        TraineePageData: (prevData, { mutationResult }) => {
          return {
            ...prevData,
            trainees: [...prevData.trainees, mutationResult.data?.createTrainee],
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'PersonNew',
          title: strings.createTrainee.title,
          text: strings.formatString(strings.createTrainee.success, `${data?.firstName} ${data?.lastName}`).toString(),
          type: 'success',
        })

        setShowModal(false)
      })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }
  const activeTrainee = data?.trainees.find((t) => isActive(t.id))
  return (
    <Template type="Main">
      {loading && <Loader />}

      {!loading &&
        data?.trainees.map((trainee, index) => (
          <TraineeRow trainee={trainee} trainerId={data.currentUser?.id} key={index} active={isActive(trainee.id)} />
        ))}
      {activeTrainee && (
        <div>
          {!pagequeryloading && dataPageQuery?.companies && dataPageQuery?.getUser?.__typename === 'Trainee' && (
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
              actions={renderDeleteAction(dataPageQuery?.getUser?.deleteAt)}
            />
          )}
          {!loading && (
            <DeletionModal
              show={showDeletionModal}
              onClose={toggleDeletionModal}
              onConfirm={() => markForDeleteTrainer(vars)}
              userName={`${activeTrainee?.firstName} ${activeTrainee?.lastName}`}
            />
          )}
        </div>
      )}

      <Fab icon="Plus" large onClick={() => setShowModal(true)} />

      <Modal large show={showModal} handleClose={() => setShowModal(false)} customClose>
        <AdminCreateUserLayout
          headline={<H1 noMargin>{strings.createTrainee.title}</H1>}
          description={
            <Paragraph fontSize="copy" color="darkFont">
              {strings.createTrainee.description}
            </Paragraph>
          }
        >
          {!loading && data?.companies ? (
            <TraineeForm
              blurSubmit={false}
              companies={data.companies}
              submit={createTrainee}
              cancel={() => setShowModal(false)}
            />
          ) : (
            <Loader />
          )}
        </AdminCreateUserLayout>
      </Modal>
    </Template>
  )
}

export default TraineePage
