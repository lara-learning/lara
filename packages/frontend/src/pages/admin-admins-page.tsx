import React from 'react'

import { AdminOverviewLayout, H1 } from '@lara/components'

import { EditUserRow } from '../components/edit-user-row'
import Loader from '../components/loader'

import { useAdminAdminsPageQuery } from '../graphql'
import strings from '../locales/localization'
import { Template } from '../templates/template'

export const AdminAdminPage: React.FC = () => {
  const { loading, data } = useAdminAdminsPageQuery()

  console.log(data)
  return (
    <Template type="Main">
      <AdminOverviewLayout heading={<H1>{strings.navigation.admin}</H1>}>
        {loading && <Loader />}

        {!loading && data?.admins.map((admin) => <EditUserRow key={admin.id} user={admin} baseUrl="admins" />)}
      </AdminOverviewLayout>
    </Template>
  )
}
