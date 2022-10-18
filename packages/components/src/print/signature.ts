import styled from 'styled-components'

import { Spacings } from '../spacing'

export const StyledSignature = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0 ${Spacings.l};
  align-items: end;
  justify-items: center;
`

export const StyledSignatureDate = styled.span`
  color: ${(props) => props.theme.darkFont};
  font-size: ${Spacings.m};
`

export const StyledSignatureLabel = styled.div`
  color: ${(props) => props.theme.mediumFont};
  font-weight: 700;
  font-size: ${Spacings.s};
  border-top: 1px solid ${(props) => props.theme.inputBorderEmpty};
  width: 100%;
  text-align: center;
  align-self: start;
`

export const StyledSignatureImage = styled.img`
  width: 80px;
  margin-bottom: -15px;
`
