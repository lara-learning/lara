import styled from 'styled-components'

export const StyledCloseButton = styled.div`
  cursor: pointer;

  &:hover {
    i {
      svg {
        fill: ${(props) => props.theme.iconBlue};
      }
    }
  }
`
