import {motion} from 'framer-motion'
import React from 'react'

import {
  Spacer,
  StyledAccordionIcon,
  StyledPaperAccordionContainer,
  StyledPaperAccordionHeader,
  StyledPaperAccordionText,
  StyledPaperAccordionTitle,
} from '@lara/components'
import PaperTextInput from "./paper-text-input";
import {
  PaperFormData,
  Trainer,
  useTrainerPaperPageDataQuery,
} from "../graphql";

interface PaperAccordionProps {
  paperInput: PaperFormData;
  setPaperBriefing: (value: PaperFormData) => void;
  title: string
  children?: React.ReactNode
  forceActive?: boolean
}

const PaperAccordion: React.FunctionComponent<PaperAccordionProps> = ({paperInput,setPaperBriefing, title, forceActive
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

  return (
    <StyledPaperAccordionContainer>
      <StyledPaperAccordionHeader onClick={handleClick}>
        <StyledPaperAccordionTitle noMargin active={active}>
          {title}
        </StyledPaperAccordionTitle>

        <StyledAccordionIcon color="iconLightGrey" size={'44px'} active={active}
                             name={'Arrow'}/>
      </StyledPaperAccordionHeader>
      <motion.div
        animate={{
          height: active ? 'auto' : 0,
        }}
        transition={{duration: 0.2}}
        initial={{
          overflow: 'hidden',
        }}
      >
        <StyledPaperAccordionText>
          {paperInput.hint}
        </StyledPaperAccordionText>

        <Spacer top="s" right="xxl" bottom="xs">
          <PaperTextInput entry={paperInput} clearOnSave={false}
                          onSave={setPaperBriefing}/>
        </Spacer>
      </motion.div>
    </StyledPaperAccordionContainer>
  )
}

export default PaperAccordion
