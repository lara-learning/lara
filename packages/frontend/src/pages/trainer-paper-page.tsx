import React from 'react'
import {RouteComponentProps} from 'react-router'

import {H1, Paragraph, Spacer} from '@lara/components'
import {Box, Flex} from '@rebass/grid'

import {PrimaryButton} from '../components/button'
import strings from '../locales/localization'
import {Template} from "../templates/template";
import EmptyPaper from "../assets/illustrations/empty-paper";

export const TrainerPaperPage: React.FunctionComponent<RouteComponentProps> = ({history}) => (
  <Template type="Main">
    <Flex alignItems={'center'} flexDirection={'column'}>
      <Box width={[1, 3 / 5]}>
        <H1 center>
          {strings.paper.empty.headline}
        </H1>
        <Paragraph center>
          {strings.paper.empty.description}
        </Paragraph>
        <Spacer y="l">
          <Flex alignItems={'center'} flexDirection={'column'}>
            <PrimaryButton
              onClick={() => history.push('/paper/createBriefing')}>{strings.paper.empty.createBriefing}
            </PrimaryButton>
          </Flex>
        </Spacer>
        <EmptyPaper />
      </Box>
    </Flex>
  </Template>
)
export default TrainerPaperPage
