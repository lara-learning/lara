import React from 'react'

import { AdminCreateUserLayout, AdminOverviewLayout, H1, Paragraph } from '@lara/components'

import { EditUserRow } from '../components/edit-user-row'
import Loader from '../components/loader'

import { useAdminAdminsPageQuery, useCreateAdminMutation } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'
import { Fab } from '../components/fab'
import Modal from '../components/modal'
import { AdminForm, EditAdminFormData } from '../components/admin-form'
import { useToastContext } from '../hooks/use-toast-context'
import { GraphQLError } from 'graphql'

export const AdminAdminsPage: React.FC = () => {
  const { loading, data } = useAdminAdminsPageQuery()
  const [mutate] = useCreateAdminMutation()

  const { addToast } = useToastContext()

  const [showModal, setShowModal] = React.useState(false)

  const createAdmin = async (data: EditAdminFormData) => {
    await mutate({
      variables: { input: data },
      updateQueries: {
        AdminAdminsPage: (prevData, { mutationResult }) => {
          return {
            ...prevData,
            admins: [...prevData.admins, mutationResult.data?.createAdmin],
          }
        },
      },
    })
      .then(() => {
        addToast({
          icon: 'PersonNew',
          title: strings.createAdmin.title,
          text: strings.formatString(strings.createAdmin.success, `${data?.firstName} ${data?.lastName}`).toString(),
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
      <AdminOverviewLayout heading={<H1>{strings.navigation.admin}</H1>}>
        {loading && <Loader />}

        {!loading && data?.admins.map((admin) => <EditUserRow key={admin.id} user={admin} baseUrl="admins" />)}
      </AdminOverviewLayout>

      <Fab icon="Plus" large onClick={() => setShowModal(true)} />

      <Modal large show={showModal} handleClose={() => setShowModal(false)} customClose>
        <AdminCreateUserLayout
          headline={<H1 noMargin>{strings.createAdmin.title}</H1>}
          description={
            <Paragraph fontSize="copy" color="darkFont">
              {strings.createAdmin.description}
            </Paragraph>
          }
        >
          {!loading ? (
            <AdminForm blurSubmit={false} submit={createAdmin} cancel={() => setShowModal(false)} />
          ) : (
            <Loader />
          )}
        </AdminCreateUserLayout>
      </Modal>
    </Template>
  )
}
