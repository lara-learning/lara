import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledNoUserPageWrapper = styled.div`
  background: ${(props) => props.theme.surface};
`

export const StyledNoUserPageContent = styled.div`
  width: 100%;
  height: auto;
  max-width: 900px;
  padding: ${Spacings.l};
  margin: 0 auto;
`

export const StyledNoUserHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 90px;
  background: ${(props) => props.theme.surface};

  svg {
    fill: ${(props) => props.theme.buttonPrimaryFont};
  }
`

export const StyledNoUserHero = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 600px;
  background-image: linear-gradient(227deg, #6996ff, #5678fb);
`

export const StyledPreviewImage = styled.img`
  width: 100%;
  margin: ${Spacings.l} 0;
  text-align: center;
`
