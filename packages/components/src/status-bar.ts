import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledStatusBar = styled.div<{ open: boolean }>`
  width: 100%;
  background: ${(props) => props.theme.warningYellow};
  color: #fff;
  padding: ${Spacings.s};
  text-align: center;
  font-weight: bold;

  .status-bar-div {
    display: ${({ open }) => (open ? 'block' : 'none')};
  }
`
