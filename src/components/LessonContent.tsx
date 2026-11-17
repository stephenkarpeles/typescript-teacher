type Props = { content: string }

/** Renders lesson text with **bold**, `code`, and blank-line paragraphs. */
export function LessonContent({ content }: Props) {
  const blocks = content.trim().split(/\n\n+/)

  return (
    <div className="lesson-body">
      {blocks.map((block, i) => {
        if (block.startsWith('```')) {
          const body = block.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
          return (
            <pre className="example-block" key={i}>
              <code>{body}</code>
            </pre>
          )
        }

        const lines = block.split('\n')
        const isList = lines.every(
          (l) => l.startsWith('- ') || l.startsWith('1.') || /^\d+\.\s/.test(l),
        )

        if (isList) {
          const ordered = lines.some((l) => /^\d+\.\s/.test(l))
          const Tag = ordered ? 'ol' : 'ul'
          return (
            <Tag key={i}>
              {lines.map((line, j) => (
                <li key={j}>
                  <Inline text={line.replace(/^(- |\d+\.\s)/, '')} />
                </li>
              ))}
            </Tag>
          )
        }

        return (
          <p key={i}>
            <Inline text={block.replace(/\n/g, ' ')} />
          </p>
        )
      })}
    </div>
  )
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
