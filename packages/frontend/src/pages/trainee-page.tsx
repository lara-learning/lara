import React from 'react'
import { useParams } from 'react-router'

import { AdminCreateUserLayout, H1, Paragraph } from '@lara/components'

import Loader from '../components/loader'
import TraineeRow from '../components/trainee-row'
import { useCreateTraineeMutation, useTraineePageDataQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { Fab } from '../components/fab'
import Modal from '../components/modal'
import { EditTraineeFormData, TraineeForm } from '../components/trainee-form'
import { useToastContext } from '../hooks/use-toast-context'
import { GraphQLError } from 'graphql'

const TraineePage: React.FunctionComponent = () => {
  const { trainee } = useParams()
  const { loading, data } = useTraineePageDataQuery()
  const [mutate] = useCreateTraineeMutation()

  const { addToast } = useToastContext()

  const [showModal, setShowModal] = React.useState(false)

  const isActive = (id: string): boolean => {
    return id === trainee
  }

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

  return (
    <Template type="Main">
      <H1>{strings.navigation.trainees}</H1>
      {loading && <Loader />}

      {!loading &&
        data?.trainees.map((trainee, index) => (
          <TraineeRow trainee={trainee} trainerId={data.currentUser?.id} key={index} active={isActive(trainee.id)} />
        ))}

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
