import { GraphQLError } from 'graphql'
import React from 'react'

import { AdminCreateUserLayout, AdminOverviewLayout, H1, Paragraph } from '@lara/components'

import { EditUserRow } from '../components/edit-user-row'
import { Fab } from '../components/fab'
import Loader from '../components/loader'
import Modal from '../components/modal'

import { useAdminMentorPageQuery, useCreateMentorMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { EditMentorFormData, MentorForm } from '../components/mentor-form'

export const AdminMentorPage: React.FC = () => {
  const { loading, data } = useAdminMentorPageQuery()
  const [mutate] = useCreateMentorMutation()

  const { addToast } = useToastContext()

  const [showModal, setShowModal] = React.useState(false)

  const createMentor = async (data: EditMentorFormData) => {
    await mutate({
      variables: { input: data },
      updateQueries: {
        AdminMentorPage: (prevData, { mutationResult }) => {
          return {
            ...prevData,
            mentors: [...prevData.mentors, mutationResult.data?.createMentor],
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'PersonNew',
          title: strings.createMentor.title,
          text: strings.formatString(strings.createMentor.success, `${data?.firstName} ${data?.lastName}`).toString(),
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
      <AdminOverviewLayout heading={<H1>{strings.navigation.mentor}</H1>}>
        {loading && <Loader />}
        {data?.mentors.map((mentor) => (
          <EditUserRow key={mentor.id} user={mentor} baseUrl="mentor" />
        ))}
      </AdminOverviewLayout>

      <Fab icon="Plus" large onClick={() => setShowModal(true)} />

      <Modal large show={showModal} handleClose={() => setShowModal(false)} customClose>
        <AdminCreateUserLayout
          headline={<H1 noMargin>{strings.createMentor.title}</H1>}
          description={
            <Paragraph fontSize="copy" color="darkFont">
              {strings.createMentor.description}
            </Paragraph>
          }
        >
          {!loading ? (
            <MentorForm blurSubmit={false} submit={createMentor} cancel={() => setShowModal(false)} />
          ) : (
            <Loader />
          )}
        </AdminCreateUserLayout>
      </Modal>
    </Template>
  )
}
