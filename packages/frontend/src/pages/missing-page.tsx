import React from 'react'
import { useNavigate } from 'react-router'

import { H1, H2, Spacer } from '@lara/components'
import { Flex } from '@rebass/grid'

import { PrimaryButton } from '../components/button'
import strings from '../locales/localization'
import { Template } from '../templates/template'

const MissingPage: React.FunctionComponent = () => {
  const navigate = useNavigate()
  return (
    <Template type="Main">
      <Flex alignItems={'center'} flexDirection={'column'}>
        <Spacer y="xl">
          <H1 center>404</H1>
          <H2 center>
            {location.pathname === '/report/missing' ? strings.missing.missingReport : strings.missing.missingPage}
          </H2>
        </Spacer>
        <PrimaryButton onClick={() => navigate('/')}>{strings.missing.back}</PrimaryButton>
      </Flex>
    </Template>
  )
}
export default MissingPage
