import React from 'react'

import { PrintTranslations } from '@lara/api'
import { StyledSignature, StyledSignatureDate, StyledSignatureImage, StyledSignatureLabel } from '@lara/components'

type SignatureProps = {
  signature?: string
  signatureDate: string
  label: string
  i18n: PrintTranslations
}

export const Signature: React.FC<SignatureProps> = ({ signature, signatureDate, label, i18n }) => {
  return (
    <StyledSignature>
      {signature && <StyledSignatureDate>{signatureDate}</StyledSignatureDate>}
      {signature && <StyledSignatureImage src={signature} />}
      <StyledSignatureLabel>{i18n.date}</StyledSignatureLabel>
      <StyledSignatureLabel>{label}</StyledSignatureLabel>
    </StyledSignature>
  )
}
