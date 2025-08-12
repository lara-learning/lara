import { motion } from 'framer-motion'
import React from 'react'

import {
  Paragraph,
  Spacer,
  StyledAccordionContainer,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionTitle,
} from '@lara/components'

interface AccordionProps {
  title: string
  children: React.ReactNode
  forceActive?: boolean
}

const Accordion: React.FunctionComponent<AccordionProps> = ({ children, title, forceActive }) => {
  const [activeState, setActiveState] = React.useState(false)

  const handleClick = () => {
    setActiveState(!activeState)
  }

  const active = forceActive || activeState

  return (
    <StyledAccordionContainer>
      <StyledAccordionHeader onClick={handleClick}>
        <StyledAccordionTitle noMargin active={active}>
          {title}
        </StyledAccordionTitle>

        <StyledAccordionIcon color="iconLightGrey" size={'44px'} active={active} name={'Arrow'} />
      </StyledAccordionHeader>
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
          <Paragraph noMargin>{children}</Paragraph>
        </Spacer>
      </motion.div>
    </StyledAccordionContainer>
  )
}

export default Accordion
