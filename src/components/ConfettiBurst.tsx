import { useEffect, useState } from 'react'

const COLORS = ['#0f7a6c', '#3ddc97', '#c47a16', '#5b8def', '#e85d4c', '#7c5cbf']

type Piece = {
  id: number
  left: string
  delay: string
  duration: string
  color: string
  rotate: string
  size: string
}

/** Lightweight CSS confetti — no library, just vibes. */
export function ConfettiBurst({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (!active) {
      setPieces([])
      return
    }
    const next: Piece[] = Array.from({ length: 28 }, (_, id) => ({
      id,
      left: `${4 + Math.random() * 92}%`,
      delay: `${Math.random() * 0.25}s`,
      duration: `${0.9 + Math.random() * 0.7}s`,
      color: COLORS[id % COLORS.length]!,
      rotate: `${Math.random() * 360}deg`,
      size: `${6 + Math.random() * 8}px`,
    }))
    setPieces(next)
    const t = window.setTimeout(() => setPieces([]), 1800)
    return () => window.clearTimeout(t)
  }, [active])

  if (pieces.length === 0) return null

  return (
    <div className="confetti-layer" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--spin' as string]: p.rotate,
          }}
        />
      ))}
    </div>
  )
}
