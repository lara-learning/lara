import { differenceInYears } from 'date-fns'
import { motion } from 'framer-motion'
import React from 'react'
import {
  Spacer,
  StyledBody,
  StyledClaimIcon,
  StyledControls,
  StyledCourse,
  StyledHeader,
  StyledIndicatorIcon,
  StyledInfoLabel,
  StyledInfoValue,
  StyledName,
  StyledUnclaimIcon,
  StyledWrapper,
  Flex,
  Box,
} from '@lara/components'

import { Company, Trainee, Trainer, useClaimTraineeMutation, useUnclaimTraineeMutation } from '../graphql'
import strings from '../locales/localization'
import Avatar from './avatar'
import Badge from './badge'
import Loader from './loader'

interface TraineeRowProps {
  active?: boolean
  trainee: Pick<Trainee, 'startDate' | 'id' | 'firstName' | 'lastName' | 'course'> & {
    trainer?: Pick<Trainer, 'id' | 'firstName' | 'lastName'>
    company?: Pick<Company, 'id' | 'name'>
  }
  trainerId?: string
}

const getTraineeshipYear = (startDateString: string) => {
  const yearsEllapsed = differenceInYears(new Date(), new Date(startDateString)) + 1
  switch (yearsEllapsed) {
    case 1:
      return strings.numerals.first
    case 2:
      return strings.numerals.second
    case 3:
      return strings.numerals.third
    case 4:
      return strings.numerals.fourth
    default:
      return yearsEllapsed
  }
}

const TraineeRow: React.FunctionComponent<TraineeRowProps> = (props) => {
  const [claimTrainee] = useClaimTraineeMutation()
  const [unclaimTrainee] = useUnclaimTraineeMutation()

  const [loading, setLoading] = React.useState(false)

  const claim = async () => {
    setLoading(true)

    await claimTrainee({
      variables: {
        id: props.trainee.id,
      },
    })

    setLoading(false)
  }

  const unclaim = async () => {
    setLoading(true)

    await unclaimTrainee({
      variables: {
        id: props.trainee.id,
      },
    })

    setLoading(false)
  }

  const { active, trainee, trainerId } = props
  const headerDestination = active ? '/trainees/' : `/trainees/${trainee.id}`
  return (
    <StyledWrapper>
      <Flex justifyContent="center" alignItems="space-between">
        <StyledHeader to={headerDestination}>
          <Avatar size={44} id={trainee.id} />
          <StyledName>
            {trainee.firstName} {trainee.lastName}
          </StyledName>
          <StyledCourse>{trainee.course}</StyledCourse>
        </StyledHeader>
        <StyledControls>
          <motion.div
            animate={{
              opacity: trainee.trainer && trainee.trainer.id === trainerId ? 1 : 0,
              scale: trainee.trainer && trainee.trainer.id === trainerId ? 1 : 0,
            }}
            initial={{
              opacity: trainee.trainer && trainee.trainer.id === trainerId ? 1 : 0,
            }}
          >
            <Badge text={strings.claimed} />
          </motion.div>
          {loading ? (
            <Loader size="24px" />
          ) : (
            <>
              {trainee.trainer && trainee.trainer.id === trainerId && (
                <Spacer onClick={unclaim} xy="m">
                  <StyledUnclaimIcon size={'24px'} name={'Unclaim'} color="iconBlue" />
                </Spacer>
              )}
              {!trainee.trainer && (
                <Spacer onClick={claim} xy="m">
                  <StyledClaimIcon size={'24px'} name={'Claim'} />
                </Spacer>
              )}
            </>
          )}

          <StyledHeader to={headerDestination}>
            <StyledIndicatorIcon color="iconLightGrey" size={'24px'} active={active} name={'Arrow'} />
          </StyledHeader>
        </StyledControls>
      </Flex>
      <motion.div
        animate={{ height: active ? 'auto' : 0 }}
        transition={{ duration: 0.5 }}
        initial={{ height: 0, overflow: 'hidden' }}
      >
        <StyledBody>
          <Flex flexDirection={'row'} flexWrap={'wrap'} py={'2'}>
            <Box width={[1, 1 / 2, 1 / 2, 1 / 2]}>
              <Flex flexDirection={'column'}>
                <StyledInfoLabel>{strings.settings.trainer}</StyledInfoLabel>
                <StyledInfoValue>
                  {trainee.trainer
                    ? `${trainee.trainer.firstName} ${trainee.trainer.lastName}`
                    : strings.traineePlaceholders.trainerPlaceholder}
                </StyledInfoValue>
                <StyledInfoLabel>{strings.traineeShipYear}</StyledInfoLabel>
                <StyledInfoValue>
                  {trainee.startDate
                    ? getTraineeshipYear(trainee.startDate)
                    : strings.traineePlaceholders.yearPlaceholder}
                </StyledInfoValue>
              </Flex>
            </Box>
            <Box width={[1, 1 / 2, 1 / 2]}>
              <Flex flexDirection={'column'}>
                <StyledInfoLabel>{strings.company}</StyledInfoLabel>
                <StyledInfoValue>
                  {trainee.company ? trainee.company.name : strings.traineePlaceholders.companyPlaceholder}
                </StyledInfoValue>
                <StyledInfoLabel>{strings.course}</StyledInfoLabel>
                <StyledInfoValue>
                  {trainee.course ? trainee.course : strings.traineePlaceholders.coursePlaceholder}
                </StyledInfoValue>
              </Flex>
            </Box>
          </Flex>
        </StyledBody>
      </motion.div>
    </StyledWrapper>
  )
}

export default TraineeRow
