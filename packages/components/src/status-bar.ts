import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledStatusBar = styled.div`
  width: 100%;
  background: ${(props) => props.theme.warningYellow};
  color: #fff;
  padding: ${Spacings.s};
  text-align: center;
  font-weight: bold;

  div {
    display: none;
  }

  &:hover div {
    display: block;
  }
`
