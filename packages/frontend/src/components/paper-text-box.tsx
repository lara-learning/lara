import React from 'react'

import { PaperFormData } from '../graphql'
import PaperCommentBubble from './paper-comment-bubble'
import { StyledAction, StyledIcon } from '@lara/components'
import { Flex } from '@rebass/grid'

interface TextBoxProps {
  paperInput: PaperFormData
  paperEntries: PaperFormData[]
  handleDelete: (value: PaperFormData) => void
}

const PaperTextBox: React.FunctionComponent<TextBoxProps> = ({ paperEntries, paperInput, handleDelete }) => {
  return (
    <>
      {paperEntries
        ? paperEntries.map((entry) =>
            entry.question == paperInput.question ? (
              <Flex key={entry.id} justifyContent={'space-between'} alignItems={'center'}>
                <PaperCommentBubble key={entry.id} message={entry.answer} />
                <StyledAction onClick={() => handleDelete(entry)}>
                  <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'} />
                </StyledAction>
              </Flex>
            ) : null
          )
        : null}
    </>
  )
}

export default PaperTextBox
