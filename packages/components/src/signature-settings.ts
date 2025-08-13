import styled from 'styled-components'

import { Box } from './box'

import { Flex } from './flex'

import { BorderRadii } from './border-radius'
import { FontSizes } from './font-size'
import { Fonts } from './fonts'
import { Spacings } from './spacing'

const HEIGHT = '200px'

export const StyledWebcamPictureContainer = styled(Box)`
  overflow: hidden;
  position: relative;
  height: ${HEIGHT};
`

export const StyledWebcamPicture = styled.img<{ pictureWidth: string }>`
  border-radius: ${BorderRadii.xxs};
  height: 100%;
  width: ${(props) => props.pictureWidth};
  object-fit: cover;
`

export const StyledWebcamLabel = styled.span`
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  color: ${(props) => props.theme.primaryPressed};
  font-family: ${Fonts.primary};
  font-size: ${FontSizes.copy};
  text-shadow: 2px 2px 4px #000000;
  &:hover {
    cursor: pointer;
  }
`

export const StyledPlaceholder = styled(Flex)`
  background-color: ${(props) => props.theme.iconDarkGrey};
  border-radius: ${BorderRadii.xxs};
  width: 100%;
  height: ${HEIGHT};
`

export const StyledSignatureLine = styled.div`
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
  width: 100%;
  border-top: 3px dashed ${(props) => props.theme.buttonPrimaryFont};
`
export const StyledNoCameraAccessWarning = styled.span.withConfig({
  shouldForwardProp: (prop) => !['visible'].includes(prop),
})<{ visible: boolean }>`
  font-size: ${FontSizes.copy};
  margin-top: ${Spacings.xs};
  margin-bottom: ${Spacings.m};
  color: ${(props) => props.theme.errorRed};
  visibility: ${(props) => !props.visible && 'hidden'};
`
