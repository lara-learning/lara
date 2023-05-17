import { motion } from 'framer-motion'
import React from 'react'

import {
  Spacer,
  StyledAccordionIcon,
  StyledPaperAccordionContainer,
  StyledPaperAccordionHeader,
  StyledPaperAccordionText,
  StyledPaperAccordionTitle,
} from '@lara/components'
import PaperTextInput from './paper-text-input'
import { PaperFormData, Trainer, useTrainerPaperPageDataQuery } from '../graphql'
import PaperTextBox from './paper-text-box'

interface PaperAccordionProps {
  paperInput: PaperFormData
  completedInput: PaperFormData[]
  setPaperBriefing: (value: PaperFormData[]) => void
  setPaperBriefingInput: (value: PaperFormData) => void
  title: string
  children?: React.ReactNode
  forceActive?: boolean
}

const PaperAccordion: React.FunctionComponent<PaperAccordionProps> = ({
  paperInput,
  setPaperBriefing,
  completedInput,
  setPaperBriefingInput,
  title,
  forceActive,
}) => {
  const [activeState, setActiveState] = React.useState(false)
  const trainerPaperPageData = useTrainerPaperPageDataQuery()

  const currentUser = trainerPaperPageData?.data?.currentUser as Trainer

  if (!currentUser) {
    return null
  }

  const handleClick = () => {
    setActiveState(!activeState)
  }

  const active = forceActive || activeState
  const handleDelete = (entry: PaperFormData) => {
    const filteredInputs: PaperFormData[] = []
    completedInput.forEach((input) => {
      if (input.id !== entry.id) {
        filteredInputs.push(input)
      }
    })
    setPaperBriefing(filteredInputs)
  }

  return (
    <StyledPaperAccordionContainer>
      <StyledPaperAccordionHeader onClick={handleClick}>
        <StyledPaperAccordionTitle noMargin active={active}>
          {title}
        </StyledPaperAccordionTitle>

        <StyledAccordionIcon color="iconLightGrey" size={'44px'} active={active} name={'Arrow'} />
      </StyledPaperAccordionHeader>
      <motion.div
        animate={{
          height: active ? 'auto' : 0,
        }}
        transition={{ duration: 0.2 }}
        initial={{
          overflow: 'hidden',
        }}
      >
        <StyledPaperAccordionText>{paperInput.hint}</StyledPaperAccordionText>

        <Spacer top="s" right="xxl" bottom="xs">
          <PaperTextInput autoFocus entry={paperInput} clearOnSave={true} onSave={setPaperBriefingInput} />
          {completedInput.length ? (
            <PaperTextBox paperInput={paperInput} paperEntries={completedInput} handleDelete={handleDelete} />
          ) : null}
        </Spacer>
      </motion.div>
    </StyledPaperAccordionContainer>
  )
}

export default PaperAccordion
