import React from 'react'

import {
  PaperFormData,
} from '../graphql'
import PaperCommentBubble from "./paper-comment-bubble";
import {StyledAction, StyledIcon} from "@lara/components";
import {Box} from "@rebass/grid";

interface TextBoxProps {
  paperInput: PaperFormData
  paperEntries: PaperFormData[]
  handleDelete: (value: PaperFormData) => void
}

const PaperTextBox: React.FunctionComponent<TextBoxProps> = ({paperEntries, paperInput, handleDelete}) => {
  return (
    <>
      {paperEntries
        ? paperEntries.map((entry) => (
          entry.question == paperInput.question ?
          <Box key={entry.id}>
            <PaperCommentBubble
              key={entry.id}
              message={entry.answer}
            />
            <StyledAction onClick={() => handleDelete(entry)} danger>
              <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'}/>
            </StyledAction>
          </Box>
            :  null
        ))
        : null}
    </>
  )
}

export default PaperTextBox
