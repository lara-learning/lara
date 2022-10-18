import styled from 'styled-components'

export const SplacePageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
`
