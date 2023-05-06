import React from 'react'

import {
  PaperFormData,
} from '../graphql'
import PaperCommentBubble from "./paper-comment-bubble";
import {StyledAction, StyledIcon} from "@lara/components";
import {Box} from "@rebass/grid";

interface TextBoxProps {
  paperEntries: PaperFormData[]
  handleDelete: (value: PaperFormData) => void
}

const PaperTextBox: React.FunctionComponent<TextBoxProps> = ({paperEntries, handleDelete}) => {
  return (
    <>
      {paperEntries
        ? paperEntries.map((entry, index) => (
          <Box key={index}>
            <PaperCommentBubble
              key={index}
              message={entry.answer}
            />
            <StyledAction onClick={() => handleDelete(entry)} danger>
              <StyledIcon name={'Trash'} size={'30px'} color={'errorRed'}/>
            </StyledAction>
          </Box>
        ))
        : null}
    </>
  )
}

export default PaperTextBox
