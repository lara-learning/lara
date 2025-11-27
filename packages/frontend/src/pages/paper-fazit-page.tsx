import { useNavigate, useParams } from 'react-router'
import { Template } from '../templates/template'
import { Container, Flex, Spacer, Spacings, StyledTextFazitArea } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import strings from '../locales/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  CursorInput,
  GetFazitDocument,
  GetFazitQuery,
  PaperStatus,
  useCurrentUserQuery,
  useFazitUpdateMutation,
  useUpdateFazitCursorPosMutation,
  useUpdatePaperMutation,
} from '../graphql'
import { styled } from 'styled-components'
import { PrimaryButton, SecondaryButton } from '../components/button'
import { omitDeep } from '@apollo/client/utilities'
import { CheckBox } from '../components/checkbox'
import { useBothDone } from '../hooks/use-both-done'

export const PaperFazitHeadline = styled.p`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 600;
  text-align: center;
  padding: ${Spacings.m};
  font-size: 20px;
  color: ${(props) => props.theme.mediumFont};
  line-height: 1.2;
`

export const PaperFazitSubline = styled.p`
  margin: 0;
  white-space: pre-wrap;
  font-weight: 500;
  word-break: break-word;
  text-align: center;
  padding-top: ${Spacings.m};
  padding-left: ${Spacings.m};
  font-size: 16px;
  color: ${(props) => props.theme.mediumFont};
  line-height: 100%;
`

export const PaperSecondarySubline = styled.p`
  margin: ${Spacings.m};
  align-content: center;
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 400;
  font-size: 12px;
  color: #757575;
  line-height: 100%;
`

export const PaperFazitPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()
  const navigate = useNavigate()

  const [localContent, setLocalContent] = useState('')
  const [localVersion, setLocalVersion] = useState(0)

  const [updateFazit] = useFazitUpdateMutation()
  const [updateCursorPosition] = useUpdateFazitCursorPosMutation()
  const [updatePaperMutation] = useUpdatePaperMutation()

  const { data: currentUser } = useCurrentUserQuery()
  const currentRole = currentUser?.currentUser?.__typename as 'Mentor' | 'Trainee'

  const textArea = useRef<HTMLTextAreaElement>(null)

  const { data } = useQuery(GetFazitDocument, {
    variables: { id: paperId },
    pollInterval: 500,
    fetchPolicy: 'cache-and-network',
    skip: !paperId,
  })

  const fazit = data?.getFazit

  const { bothDone, currentRoleDone, handleToggleDone } = useBothDone({
    fazit: {
      mentorDone: fazit?.mentorDone ?? false,
      traineeDone: fazit?.traineeDone ?? false,
    },
    currentRole,
    paperId: paperId!,
    localContent,
    localVersion,
    currentUserId: currentUser?.currentUser?.id ?? '',
    updateFazit,
  })

  useEffect(() => {
    const fazit: GetFazitQuery | undefined = data as GetFazitQuery
    if (fazit?.getFazit && fazit.getFazit.version > localVersion) {
      const remote = fazit.getFazit

      if (remote.content !== localContent) {
        const cp = textArea.current?.selectionStart || 0

        setLocalContent(remote.content)
        setLocalVersion(remote.version)

        requestAnimationFrame(() => {
          if (textArea.current) {
            textArea.current.selectionStart = cp
            textArea.current.selectionEnd = cp
          }
        })
      } else {
        setLocalVersion(remote.version)
      }
    }
  }, [data, localVersion, localContent])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      const cursorPos = e.target.selectionStart

      setLocalContent(newContent)
      setLocalVersion(localVersion + 1)

      const newCursorPos: CursorInput = {
        position: cursorPos,
        owner: currentUser?.currentUser?.id ?? '',
      }

      updateFazit({
        variables: { id: paperId ?? '', content: newContent, version: localVersion + 1, cursorPosition: newCursorPos },
      })
    },
    [paperId, updateFazit, localVersion, currentUser?.currentUser?.id]
  )

  const syncFinal = () => {
    const newCursorPos: CursorInput = {
      position: textArea.current?.selectionStart ?? 0,
      owner: currentUser?.currentUser?.id ?? '',
    }
    updateFazit({
      variables: { id: paperId ?? '', content: localContent, version: localVersion + 1, cursorPosition: newCursorPos },
    }).then(() => {
      if (
        currentUser?.currentUser?.__typename === 'Trainee' ||
        currentUser?.currentUser?.__typename === 'Trainer' ||
        currentUser?.currentUser?.__typename === 'Mentor'
      ) {
        const paper = currentUser.currentUser.papers?.filter((paper) => paper?.id === paperId)[0]
        console.log(paper)
        updatePaperMutation({
          variables: {
            input: {
              briefing: omitDeep(paper?.briefing ?? [], '__typename'),
              client: paper?.client ?? '',
              didSendEmail: false,
              feedbackMentor: omitDeep(paper?.feedbackMentor ?? [], '__typename'),
              feedbackTrainee: omitDeep(paper?.feedbackTrainee ?? [], '__typename'),
              id: paperId ?? '',
              mentorId: paper?.mentorId ?? '',
              status: PaperStatus.ReviewDone,
              subject: paper?.subject ?? '',
              traineeId: paper?.traineeId ?? '',
              trainerId: paper?.trainerId ?? '',
            },
          },
        }).then(() => navigate('/paper'))
      }
    })
  }

  const handleCursorMove = useCallback(() => {
    const cursorPos = textArea.current?.selectionStart || 0
    updateCursorPosition({
      variables: {
        id: paperId ?? '',
        cursorPosition: { owner: currentUser?.currentUser?.id ?? '', position: cursorPos },
      },
    })
  }, [paperId, updateCursorPosition, currentUser?.currentUser?.id])

  return (
    <Template type="Main">
      {!paperId || !fazit ? (
        <div>Loading...</div>
      ) : (
        <>
          <Spacer bottom="m">
            <NavigationButtonLink
              label={strings.back}
              to="/paper"
              icon="ChevronLeft"
              isLeft
              alignLeft
              iconColor="iconLightGrey"
            />
          </Spacer>
          <Container>
            <PaperSecondarySubline style={{ color: '#000000' }}>{strings.paper.fazit.info}</PaperSecondarySubline>
          </Container>
          <Spacer bottom="l">
            <div></div>
          </Spacer>
          <Container>
            <PaperFazitHeadline>{strings.paper.fazit.headline}</PaperFazitHeadline>
            <PaperFazitSubline>{strings.paper.fazit.subline}</PaperFazitSubline>
            <PaperSecondarySubline>{strings.paper.fazit.secondarySubline}</PaperSecondarySubline>
            <StyledTextFazitArea
              placeholder={strings.paper.fazit.placeholder}
              ref={textArea}
              value={localContent}
              onClick={handleCursorMove}
              onKeyUp={handleCursorMove}
              onChange={handleChange}
            />
            <Spacer bottom="m">
              <div></div>
            </Spacer>
            <CheckBox
              iconName="Checkbox"
              checked={currentRoleDone}
              onClick={() => {
                console.log(
                  'Checkbox clicked:',
                  JSON.stringify({
                    currentRole,
                    isDoneBeforeClick: currentRoleDone,
                    mentorDone: fazit?.mentorDone,
                    traineeDone: fazit?.traineeDone,
                    bothDone,
                  })
                )
                handleToggleDone()
              }}
            />

            <Spacer bottom="m">
              <div></div>
            </Spacer>
          </Container>
          <Spacer bottom="xl">
            <div></div>
          </Spacer>
          <Flex style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SecondaryButton onClick={() => window.location.reload()}>{strings.paper.fazit.reloadPage}</SecondaryButton>
            <PrimaryButton disabled={!bothDone} onClick={syncFinal}>
              {strings.paper.fazit.completeFeedback}
            </PrimaryButton>
          </Flex>
        </>
      )}
    </Template>
  )
}
