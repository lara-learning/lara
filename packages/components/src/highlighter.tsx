interface highlighterProps {
  term: string
  children: string
}

const Highlighter: React.FC<highlighterProps> = ({ term, children }) => {
  if (!term) {
    return <>{children}</>
  }
  const regex = new RegExp(`(${term})`, 'gi')
  const parts = children.split(regex)
  console.log(parts)

  return (
    <>
      <div>test</div>
      {parts.map((part: string, index: number) =>
        regex.test(part) ? (
          <span
            key={index}
            style={{
              margin: 0,
              backgroundColor: 'rgb(84 198 247)',
              padding: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
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
  )
}

export default Highlighter
