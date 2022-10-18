import { GraphQLError } from 'graphql'
import React from 'react'

import { AdminCreateUserLayout, AdminOverviewLayout, H1, Paragraph } from '@lara/components'

import { EditUserRow } from '../components/edit-user-row'
import { Fab } from '../components/fab'
import Loader from '../components/loader'
import Modal from '../components/modal'
import { EditTraineeFormData, TraineeForm } from '../components/trainee-form'
import { useAdminTraineesPageQuery, useCreateTraineeMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'

export const AdminTraineesPage: React.FC = () => {
  const { loading, data } = useAdminTraineesPageQuery()
  const [mutate] = useCreateTraineeMutation()

  const { addToast } = useToastContext()

  const [showModal, setShowModal] = React.useState(false)

  const createTrainee = async (data: EditTraineeFormData) => {
    await mutate({
      variables: { input: data },
      updateQueries: {
        AdminTraineesPage: (prevData, { mutationResult }) => {
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

  return (
    <Template type="Main">
      <AdminOverviewLayout heading={<H1>{strings.navigation.trainees}</H1>}>
        {loading && <Loader />}

        {!loading &&
          data?.trainees.map((trainee) => <EditUserRow key={trainee.id} user={trainee} baseUrl="trainees" />)}
      </AdminOverviewLayout>

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
