import {motion} from 'framer-motion'
import React from 'react'

import {
  IconName,
  Spacer,
  StyledAccordionIcon,
  StyledPaperAccordionContainer,
  StyledPaperAccordionHeader, StyledPaperAccordionTitle,
} from '@lara/components'
import PaperTextInput from "./paper-text-input";
import {
  AnswerPaperInput, PaperFormData,
  useCreatePaperEntryMutation
} from "../graphql";
import {EntryStatusType, StatusTypes} from "./day-input";

interface PaperAccordionProps {
  paperInput: PaperFormData;
  title: string
  children?: React.ReactNode
  forceActive?: boolean
}

const PaperAccordion: React.FunctionComponent<PaperAccordionProps> = ({paperInput, title, forceActive
}) => {
  const [activeState, setActiveState] = React.useState(false)
  const [createPaperEntryMutation] = useCreatePaperEntryMutation()
  const StatusIcons: Record<string, IconName> = {
    success: 'Success',
    error: 'Error',
    loading: 'Loader',
  }
  const [_statusVisible, setStatusVisible] = React.useState(false)
  const [statusTimeout, setStatusTimeout] = React.useState<number>()
  const [_status, setStatus] = React.useState<EntryStatusType & { icon: IconName }>({
    message: '',
    type: '',
    icon: 'Loader',
  })
  const handleStatusChange = (newStatus: EntryStatusType) => {
    clearTimeout(statusTimeout)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    setStatus({ ...newStatus, icon: StatusIcons[newStatus.type] })
    setStatusVisible(true)

    if (newStatus.type !== 'loading') {
      const timeout = window.setTimeout(() => {
        setStatusVisible(false)
      }, 1000)

      setStatusTimeout(timeout)
    }
  }
  const createEntry = (paperInput: AnswerPaperInput) => {

    createPaperEntryMutation({
      variables: {
        input: {
          answer: paperInput.answer,
          id: paperInput.id,
          question: paperInput.question,
        },
      },
      optimisticResponse: {
        createPaperEntry: {
          __typename: 'PaperFormData',
          ...paperInput,
          hint: "das",
        },
      },
    })
    .then(() => handleStatusChange(StatusTypes.save.success))
    .catch(() => handleStatusChange(StatusTypes.save.error))
  }
 // const statusChange = (status: EntryStatusType) => handleStatusChange && handleStatusChange(status)

  /*const handleSave = (newPaperInput: AnswerPaperInput) => {
    if (newPaperInput.answer === paperInput.answer) {
      return
    }

    statusChange(StatusTypes.loading)
  }*/
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
        <Spacer top="s" right="xxl" bottom="xs">
          <PaperTextInput entry={paperInput} clearOnSave={true}
                          onSave={createEntry}/>
        </Spacer>
      </motion.div>
    </StyledPaperAccordionContainer>
  )
}

export default PaperAccordion
