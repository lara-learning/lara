import styled from 'styled-components'
import { Spacings } from './spacing'

interface StyledLoaderProps {
  padding?: string | LoaderSize
}

export enum LoaderSize {
  Small = '20px',
  Medium = '40px',
  Big = '50px',
}

export const StyledLoaderContainer = styled.div<StyledLoaderProps>`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: ${(props) => props.padding || Spacings.m};
`
