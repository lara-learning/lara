import React from 'react'
import {RouteComponentProps} from 'react-router'

import {H1, Paragraph, Spacer, Text, Title} from '@lara/components'
import {Box, Flex} from '@rebass/grid'

import {PrimaryButton} from '../components/button'
import strings from '../locales/localization'
import {Template} from "../templates/template";
import EmptyPaper from "../assets/illustrations/empty-paper";
import {Trainer, useTrainerPaperPageDataQuery} from "../graphql";
import Accordion from "../components/accordion";
import Loader from "../components/loader";

export const TrainerPaperPage: React.FC<RouteComponentProps> = ({history}) => {
  const {loading, data} = useTrainerPaperPageDataQuery()
  if (loading) {
    return <Loader size="xl" padding="xl"/>
  }

  if (!data) {
    return null
  }

  const currentUser = data?.currentUser as Trainer
  if (!currentUser) {
    return null
  }
  return (
    <Template type="Main">
      <div key={currentUser.id}>
        {currentUser?.papers && currentUser?.papers?.length >= 1 ? (
            currentUser?.papers?.map((paper) => (
                <Accordion key={paper?.id}
                           title={paper?.client + ' ' + paper?.subject}>
                  <div key={paper?.periodEnd}>
                    <Title>{paper?.subject}</Title>
                    <Text size="copy">
                      {paper?.periodStart + ' - ' + paper?.periodEnd}
                    </Text>
                  </div>
                </Accordion>
            ))
        ) : (
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
              <EmptyPaper/>
            </Box>
          </Flex>
        )}
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
            <EmptyPaper/>
          </Box>
        </Flex>
      </div>
    </Template>
  )
}
