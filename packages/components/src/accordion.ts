import styled, { css } from 'styled-components'
import { Container } from './container'
import { FontSizes } from './font-size'
import { StyledIcon } from './icons'
import { Paragraph } from './paragraph'
import { Spacings } from './spacing'

interface AccordionState {
  active: boolean
}

export const StyledAccordionContainer = styled(Container)`
  width: 100%;
  padding: ${Spacings.xs} ${Spacings.xs} ${Spacings.xs} ${Spacings.s};
  margin-bottom: ${Spacings.l};

  :hover {
    & svg {
      fill: ${(props) => props.theme.iconBlue};
    }
  }
`

export const StyledAccordionHeader = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledAccordionTitle = styled(Paragraph).withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<AccordionState>`
  font-size: ${FontSizes.copy};
  transition: font-weight 0.1s;
  user-select: none;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      color: ${props.theme.darkFont};
      font-weight: bold;
      letter-spacing: 0.3px;
      transition: font-weight 0.1s;
    `}
`

export const StyledAccordionIcon = styled(StyledIcon).withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<AccordionState>`
  transform: rotate(${(props) => (props.active ? '180deg' : '0deg')});
  transition: all 0.2s;
`
