import { GraphQLError } from 'graphql'
import ImageTracer from 'imagetracerjs'
import React from 'react'
import Webcam from 'react-webcam'

import {
  H2,
  LoaderSize,
  Paragraph,
  Spacings,
  StyledIcon,
  StyledNoCameraAccessWarning,
  StyledPlaceholder,
  StyledSignatureLine,
  StyledWebcamLabel,
  StyledWebcamPicture,
  StyledWebcamPictureContainer,
} from '@lara/components'
import { Box, Flex } from '@rebass/grid'

import { useSignatureSettingsDataQuery, useSignatureSettingsUpdateSignatureMutation } from '../graphql'
import { useToastContext } from '../hooks/use-toast-context'
import strings from '../locales/localization'
import { PrimaryButton, SecondaryButton } from './button'
import Illustrations from './illustration'
import Loader from './loader'
import Modal from './modal'

const SignatureSettings: React.FunctionComponent = () => {
  const { loading, data } = useSignatureSettingsDataQuery()
  const [mutate] = useSignatureSettingsUpdateSignatureMutation()
  const { addToast } = useToastContext()

  const [showSignatureScanner, setShowSignatureScanner] = React.useState(false)
  const [imgSrc, setImgSrc] = React.useState('')
  const [svgString, setSvgString] = React.useState('')
  const [webcamActive, setWebcamActive] = React.useState(false)

  const webcam = React.useRef<Webcam>(null)

  const toggleSignatureScanner = () => {
    clearImages()
    setShowSignatureScanner(!showSignatureScanner)
  }

  const finishedScan = React.useCallback((svgstring: string) => {
    const tempSvg = svgstring.split('<path ')
    const formattedSvg: string[] = []
    tempSvg.map((path) => {
      if (path.substring(0, 4) === '<svg') {
        formattedSvg.push(path)
      } else if (path.substring(12, 13) === ',') {
        formattedSvg.push('<path ' + path)
      }
    })

    // add closing svg tag if missing
    if (!formattedSvg[formattedSvg.length - 1].includes('</svg>')) {
      formattedSvg.push('</svg>')
    }

    if (formattedSvg.length <= 1) {
      clearImages()
    } else {
      setSvgString(window.btoa(formattedSvg.join()))
    }
  }, [])

  React.useEffect(() => {
    const options = {
      scale: 10,
      linefilter: true,
      strokewidth: 15,
      pathomit: 3,
      qtres: 3,
      pal: [
        { r: 0, g: 0, b: 0, a: 0 },
        { r: 0, g: 0, b: 0, a: 0 },
      ],
    }

    ImageTracer.imageToSVG(imgSrc, finishedScan, options)
  }, [imgSrc, finishedScan])

  const clearImages = () => {
    setImgSrc('')
    setSvgString('')
  }

  const saveSignature = () => {
    if (!imgSrc) {
      setImgSrc(webcam.current?.getScreenshot() ?? '')
    } else {
      updateSignature(svgString)
      toggleSignatureScanner()
    }
  }

  const updateSignature = (newSignature: string) => {
    mutate({
      optimisticResponse: {
        updateCurrentUser: {
          ...currentUser,
          id: currentUser?.id ?? '0',
          signature: newSignature,
        },
      },
      variables: {
        signature: newSignature,
      },
    })
      .then(() => {
        if (newSignature) {
          addToast({
            icon: 'Pen',
            title: strings.settings.signature.addSuccessTitle,
            text: strings.settings.signature.addSuccess,
            type: 'success',
          })
        } else {
          addToast({
            icon: 'Pen',
            title: strings.settings.signature.deleteSuccessTitle,
            text: strings.settings.signature.deleteSuccess,
            type: 'error',
          })
        }
      })
      .catch((exception: GraphQLError) => {
        addToast({
          title: strings.errors.error,
          text: exception.message,
          type: 'error',
        })
      })
  }

  if (loading || !data) {
    return <Loader size={LoaderSize.Big} padding="xl" />
  }

  const { currentUser } = data

  if (!currentUser) {
    return null
  }

  const { signature } = currentUser

  return (
    <>
      {signature ? (
        <Flex flexWrap={'wrap'}>
          <Flex width={1 / 4} justifyContent={'center'}>
            <StyledWebcamPicture pictureWidth="60%" src={`data:image/svg+xml;base64,${signature}`} />
          </Flex>
          <Flex width={3 / 4} pl="3" flexDirection={'column'} justifyContent={'center'}>
            <Flex alignItems={'center'}>
              <PrimaryButton onClick={() => updateSignature('')} icon={'Trash'}>
                {strings.settings.signature.deleteSignature}
              </PrimaryButton>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex flexWrap={'wrap'} justifyContent="space-between">
          <Box width={[0, 1 / 5, 1 / 5, 1 / 5]}>
            <Illustrations.Scanner />
          </Box>
          <Box width={[1, 3 / 4, 3 / 4, 3 / 4]}>
            <Flex alignItems="center">
              <H2 style={{ margin: 0 }}>{strings.settings.signature.placeholder.heading}</H2>
            </Flex>
            <Paragraph margin={`${Spacings.s}`} color="darkFont" fontSize="copy">
              {strings.settings.signature.placeholder.description}
            </Paragraph>
            <PrimaryButton icon={'Camera'} onClick={toggleSignatureScanner}>
              {strings.settings.signature.addSignature}
            </PrimaryButton>
          </Box>
        </Flex>
      )}
      <Modal show={showSignatureScanner} customClose handleClose={toggleSignatureScanner}>
        <H2>{strings.settings.signature.modal.title}</H2>
        <Paragraph>{strings.settings.signature.modal.label}</Paragraph>
        <Flex justifyContent={'space-between'}>
          <StyledWebcamPictureContainer width={1 / 2}>
            {!webcamActive && !imgSrc && (
              <StyledPlaceholder alignItems={'center'} justifyContent={'center'}>
                <StyledIcon name={'CameraOff'} size={'100px'} color={'iconLightGrey'} />
              </StyledPlaceholder>
            )}
            {imgSrc && (
              <>
                <StyledWebcamPicture pictureWidth="100%" src={imgSrc} />
                <StyledWebcamLabel
                  onClick={clearImages}
                >{`↻ ${strings.settings.signature.modal.newtry}`}</StyledWebcamLabel>
              </>
            )}
            {!imgSrc && showSignatureScanner && (
              <>
                {webcamActive && <StyledSignatureLine />}
                <Webcam
                  width="100%"
                  audio={false}
                  screenshotFormat="image/png"
                  ref={webcam}
                  onUserMedia={() => setWebcamActive(true)}
                />
              </>
            )}
          </StyledWebcamPictureContainer>
          <StyledWebcamPictureContainer width={1 / 2}>
            {svgString && <StyledWebcamPicture pictureWidth="100%" src={`data:image/svg+xml;base64,${svgString}`} />}
          </StyledWebcamPictureContainer>
        </Flex>
        <StyledNoCameraAccessWarning visible={!webcamActive}>
          {strings.settings.signature.modal.error}
        </StyledNoCameraAccessWarning>
        <Flex>
          <Box pr={'1'} width={1 / 2}>
            <SecondaryButton fullsize onClick={toggleSignatureScanner}>
              {strings.cancel}
            </SecondaryButton>
          </Box>
          <Box pl={'1'} width={1 / 2}>
            <PrimaryButton
              disabled={!webcamActive}
              icon={imgSrc ? 'CloudUpload' : 'Camera'}
              fullsize
              onClick={saveSignature}
            >
              {imgSrc ? strings.save : strings.settings.signature.modal.record}
            </PrimaryButton>
          </Box>
        </Flex>
      </Modal>
    </>
  )
}

export default SignatureSettings
