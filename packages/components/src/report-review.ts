import styled from 'styled-components'
import { FontSizes } from './font-size'
import { Spacings } from './spacing'
import { H2, HeaderProps } from './heading'

export const StyledDepartmentHeadline = styled.span`
  color: ${(props) => props.theme.mediumFont};
  font-size: ${FontSizes.copy};
  span {
    font-size: ${FontSizes.copy};
    font-weight: 600;
    letter-spacing: 0.3;
    font-variant: small-caps;
  }
`

export const StyledTotalContainer = styled.div`
  padding: ${Spacings.m} ${Spacings.l};
  text-align: right;
`
export const StyledTraineeName = styled(H2)<HeaderProps>`
  text-align: right;
  word-break: break-word;
`
