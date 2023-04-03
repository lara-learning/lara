import { motion } from 'framer-motion'
import React from 'react'

import {
  Spacer,
  StyledAccordionIcon,
  StyledPaperAccordionContainer,
  StyledPaperAccordionHeader, StyledPaperAccordionTitle,
} from '@lara/components'
import PaperTextInput from "./paper-text-input";
import {AnswerPaperInput, EntryInput as EntryInputType} from "../graphql";
import {EntryStatusType, StatusTypes} from "./day-input";
import strings from "../locales/localization";

interface PaperAccordionProps {
  paperInput: AnswerPaperInput
  title: string
  children?: React.ReactNode
  forceActive?: boolean
  handleStatusChange?: (status: EntryStatusType) => void
}

const PaperAccordion: React.FunctionComponent<PaperAccordionProps> = ({ paperInput, title, forceActive, handleStatusChange}) => {
  const [activeState, setActiveState] = React.useState(false)
  const createEntry = (paperInput: AnswerPaperInput) => {

    createEntryMutation({
      variables: {
        input: {
          text: entry.text,
          time: entry.time,
        },
        dayId: day.id,
      },
      optimisticResponse: {
        createEntry: {
          __typename: 'MutateEntryPayload',
          day: {
            __typename: 'Day',
            ...day,
            entries: [
              ...day.entries,
              {
                __typename: 'Entry',
                id: 'null',
                ...entry,
                comments: [],
                orderId: day.entries.length,
              },
            ],
          },
        },
      },
    })
  }
  const statusChange = (status: EntryStatusType) => handleStatusChange && handleStatusChange(status)

  const handleSave = (newPaperInput: AnswerPaperInput) => {
    if (newPaperInput.answer === paperInput.answer) {
      return
    }

    statusChange(StatusTypes.loading)
  }
  const handleClick = () => {
    setActiveState(!activeState)
  }

  const active = forceActive || activeState

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
        <Spacer top="s" right="xxl" bottom="xs">
          <PaperTextInput entry={paperInput} clearOnSave={true} onSave={handleSave && createEntry}/>
        </Spacer>
      </motion.div>
    </StyledPaperAccordionContainer>
  )
}

export default PaperAccordion
