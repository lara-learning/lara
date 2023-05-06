import React from 'react'

import {
  PaperFormData,
} from '../graphql'
import PaperCommentBubble from "./paper-comment-bubble";

interface TextBoxProps {
  entry: PaperFormData[]
}

const PaperTextBox: React.FunctionComponent<TextBoxProps> = ({ entry }) => {
  return (
    <>
      {entry
        ? entry.map((entry, index) => (
            <PaperCommentBubble
              key={index}
              message={entry.answer}
            />
          ))
        : null}
    </>
  )
}

export default PaperTextBox
