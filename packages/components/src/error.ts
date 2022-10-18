import styled from 'styled-components'

export const StyledErrorPageWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.errorRed};
  top: 0;
  left: 0;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const StyledErrorPageContent = styled.div`
  max-width: 700px;
`
