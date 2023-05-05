import styled, { css } from 'styled-components'
import { Container } from './container'
import { FontSizes } from './font-size'
import { StyledIcon } from './icons'
import { Paragraph } from './paragraph'
import { Spacings } from './spacing'

interface PaperAccordionState {
  active: boolean
}

export const StyledPaperAccordionContainer = styled(Container)`
  width: 100%;
  padding: ${Spacings.xs} ${Spacings.xs} ${Spacings.xs} ${Spacings.s};
  margin-bottom: ${Spacings.l};

  :hover {
    & svg {
      fill: ${(props) => props.theme.iconBlue};
    }
  }
`

export const StyledPaperAccordionText = styled(Paragraph)`
  font-size: ${FontSizes.copy};
`

export const StyledPaperAccordionHeader = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${FontSizes.h2};
`

export const StyledPaperAccordionTitle = styled(Paragraph)<PaperAccordionState>`
  font-size: ${FontSizes.h2};
  transition: font-weight 0.1s;
  user-select: none;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      font-size: ${FontSizes.h2};
      color: ${props.theme.darkFont};
      font-weight: bold;
      letter-spacing: 0.3px;
      transition: font-weight 0.1s;
    `}
`

export const StyledPaperAccordionIcon = styled(StyledIcon)<PaperAccordionState>`
  transform: rotate(${(props) => (props.active ? '180deg' : '0deg')});
  transition: all 0.2s;
`
