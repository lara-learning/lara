import styled from 'styled-components'
import { Spacings } from './spacing'

export const StyledSecondaryTemplateWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: ${Spacings.m};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  footer {
    position: absolute;
    bottom: 0;
    svg {
      fill: ${(props) => props.theme.darkFont};
    }
    @media screen and (max-height: 40em) {
      position: static;
      margin-top: ${Spacings.m};
    }
  }
`

export const StyledMainTemplateWrapper = styled.div`
  max-width: 700px;
  margin: ${Spacings.xxl} auto;

  @media (max-width: 800px) {
    padding: 0 ${Spacings.m};
  }
`
