import { GraphQLError } from 'graphql'
import React from 'react'

import { AdminCreateUserLayout, AdminOverviewLayout, H1, Paragraph } from '@lara/components'

import { TrainerForm, EditTrainerFormData } from '../components/trainer-form'
import { EditUserRow } from '../components/edit-user-row'
import { Fab } from '../components/fab'
import Loader from '../components/loader'
import Modal from '../components/modal'

import { useAdminTrainersPageQuery, useCreateTrainerMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'

export const AdminTrainerPage: React.FC = () => {
  const { loading, data } = useAdminTrainersPageQuery()
  const [mutate] = useCreateTrainerMutation()

  const { addToast } = useToastContext()

  const [showModal, setShowModal] = React.useState(false)

  const createTrainer = async (data: EditTrainerFormData) => {
    await mutate({
      variables: { input: data },
      updateQueries: {
        AdminTrainersPage: (prevData, { mutationResult }) => {
          return {
            ...prevData,
            trainers: [...prevData.trainers, mutationResult.data?.createTrainer],
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'PersonNew',
          title: strings.createTrainer.title,
          text: strings.formatString(strings.createTrainer.success, `${data?.firstName} ${data?.lastName}`).toString(),
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

  return (
    <Template type="Main">
      <AdminOverviewLayout heading={<H1>{strings.navigation.trainer}</H1>}>
        {loading && <Loader />}

        {!loading && data?.trainers.map((trainer) => <EditUserRow key={trainer.id} user={trainer} baseUrl="trainer" />)}
      </AdminOverviewLayout>

      <Fab icon="Plus" large onClick={() => setShowModal(true)} />

      <Modal large show={showModal} handleClose={() => setShowModal(false)} customClose>
        <AdminCreateUserLayout
          headline={<H1 noMargin>{strings.createTrainer.title}</H1>}
          description={
            <Paragraph fontSize="copy" color="darkFont">
              {strings.createTrainer.description}
            </Paragraph>
          }
        >
          {!loading ? (
            <TrainerForm blurSubmit={false} submit={createTrainer} cancel={() => setShowModal(false)} />
          ) : (
            <Loader />
          )}
        </AdminCreateUserLayout>
      </Modal>
    </Template>
  )
}
