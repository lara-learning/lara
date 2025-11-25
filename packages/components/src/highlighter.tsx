import { styled } from 'styled-components'

interface highlighterProps {
  term: string
  children: string
}

const Text = styled.p`
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
`

const Highlighter: React.FC<highlighterProps> = ({ term, children }) => {
  if (!term) {
    return <Text>{children}</Text>
  }
  const regex = new RegExp(`(${term})`, 'gi')
  const parts = children.split(regex)

  return (
    <>
      <Text>
        <>
          {parts.map((part: string, index: number) =>
            regex.test(part) ? (
              <span
                key={index}
                style={{
                  backgroundColor: 'rgb(84 198 247)',
                  fontWeight: 'bold',
                }}
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      </Text>
    </>
  )
}

export default Highlighter
