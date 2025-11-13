import { useParams } from 'react-router'
import { Template } from '../templates/template'
import { Spacer, StyledInputTextArea } from '@lara/components'
import NavigationButtonLink from '../components/navigation-button-link'
import strings from '../locales/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  CursorInput,
  GetFazitDocument,
  GetFazitQuery,
  useCurrentUserQuery,
  useFazitUpdateMutation,
  useUpdateFazitCursorPosMutation,
} from '../graphql'

export const PaperFazitPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>()

  const [localContent, setLocalContent] = useState('')
  const [localVersion, setLocalVersion] = useState(0)

  const [updateFazit] = useFazitUpdateMutation()
  const [updateCursorPosition] = useUpdateFazitCursorPosMutation()

  const { data: currentUser } = useCurrentUserQuery()

  const textArea = useRef<HTMLTextAreaElement>(null)

  const { data } = useQuery(GetFazitDocument, {
    variables: { id: paperId },
    pollInterval: 500,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const fazit: GetFazitQuery | undefined = data as GetFazitQuery
    if (fazit) {
      console.log(fazit)
      if (fazit.getFazit && fazit.getFazit?.version >= localVersion) {
        const remote = fazit.getFazit
        console.log('remote: ', remote)

        setLocalContent(remote.content)
        setLocalVersion(remote.version)
      }
    }
  }, [data, localVersion, paperId])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      const cursorPos = e.target.selectionStart

      console.log('handle change, nc: ', newContent)

      setLocalContent(newContent)
      setLocalVersion(localVersion + 1)

      const newCursorPos: CursorInput = {
        position: cursorPos,
        owner: currentUser?.currentUser?.id ?? '',
      }

      updateFazit({
        variables: { id: paperId ?? '', content: newContent, version: localVersion + 1, cursorPosition: newCursorPos },
      }).then((newFazit) => {
        if (newFazit.data?.updateFazit.success) {
          setLocalContent(newFazit.data.updateFazit.newFazit.content)
          setLocalVersion(newFazit.data.updateFazit.newFazit.version)
        }
      })
    },
    [paperId, updateFazit]
  )

  const handleCursorMove = useCallback(() => {
    const cursorPos = textArea.current?.selectionStart || 0
    updateCursorPosition({
      variables: {
        id: paperId ?? '',
        cursorPosition: { owner: currentUser?.currentUser?.id ?? '', position: cursorPos },
      },
    })
  }, [paperId, updateCursorPosition])

  return (
    <Template type="Main">
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
      {paperId}

      <StyledInputTextArea
        ref={textArea}
        value={localContent}
        onClick={handleCursorMove}
        onKeyUp={handleCursorMove}
        onChange={handleChange}
      ></StyledInputTextArea>
    </Template>
  )
}
