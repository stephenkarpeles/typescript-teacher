type Props = { content: string }

type Segment =
  | { kind: 'code'; body: string }
  | { kind: 'text'; body: string }

/** Split lesson markdown into text segments and fenced code blocks. */
function segmentContent(content: string): Segment[] {
  const segments: Segment[] = []
  const fence = /```(?:\w+)?\n?([\s\S]*?)```/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = fence.exec(content)) !== null) {
    if (match.index > last) {
      segments.push({ kind: 'text', body: content.slice(last, match.index) })
    }
    segments.push({ kind: 'code', body: match[1].replace(/\n$/, '') })
    last = match.index + match[0].length
  }

  if (last < content.length) {
    segments.push({ kind: 'text', body: content.slice(last) })
  }

  return segments
}

/** Renders lesson text with **bold**, `code`, lists, and fenced code blocks. */
export function LessonContent({ content }: Props) {
  const segments = segmentContent(content.trim())

  return (
    <div className="lesson-body">
      {segments.map((segment, i) => {
        if (segment.kind === 'code') {
          return (
            <pre className="example-block" key={`code-${i}`}>
              <code>{segment.body}</code>
            </pre>
          )
        }

        const blocks = segment.body.split(/\n\n+/).filter((b) => b.trim())

        return blocks.map((block, j) => {
          const lines = block.split('\n')
          const isList = lines.every(
            (l) => l.startsWith('- ') || l.startsWith('1.') || /^\d+\.\s/.test(l),
          )

          if (isList) {
            const ordered = lines.some((l) => /^\d+\.\s/.test(l))
            const Tag = ordered ? 'ol' : 'ul'
            return (
              <Tag key={`text-${i}-${j}`}>
                {lines.map((line, k) => (
                  <li key={k}>
                    <Inline text={line.replace(/^(- |\d+\.\s)/, '')} />
                  </li>
                ))}
              </Tag>
            )
          }

          return (
            <p key={`text-${i}-${j}`}>
              <Inline text={block.replace(/\n/g, ' ').trim()} />
            </p>
          )
        })
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
