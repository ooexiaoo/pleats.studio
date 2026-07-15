import { PleatType } from '../../types'
import type { PleatInputs, PleatResults } from '../../types'

interface Props {
  inputs: PleatInputs
  results: PleatResults
  maxHeight?: string
}

const COLORS = {
  ivory: '#FAF7F2',
  charcoal: '#2D2926',
  charcoalLight: '#5A5450',
  rose: '#C4727F',
  sage: '#8FA68A',
  sageLight: '#B3C9AF',
}

const MAX_SHOW = 6

export default function SideProfile({ inputs, results, maxHeight }: Props) {
  const { numberOfPleats, pleatType } = inputs
  const { visibleWidthPerPleat, pleatDepth, totalFabricWidth } = results

  const n = Math.min(numberOfPleats, MAX_SHOW)
  const truncated = numberOfPleats > MAX_SHOW

  const vw = visibleWidthPerPleat
  const dw = pleatDepth

  const foldH = dw * 5
  const padX = vw * 2
  const padTop = 12
  const padBot = 12

  const baseY = padTop + foldH + 4
  const topY = baseY - foldH
  const botY = baseY + foldH

  let step = 0
  let pathD = ''

  if (pleatType === PleatType.Knife) {
    step = vw + dw
    for (let i = 0; i < n; i++) {
      const x = padX + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${topY}`
      pathD += ` L${x + vw + dw},${topY}`
      pathD += ` L${x + vw + dw},${baseY}`
    }
  } else if (pleatType === PleatType.Box) {
    step = vw + dw * 2
    for (let i = 0; i < n; i++) {
      const x = padX + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${topY}`
      pathD += ` L${x + vw + dw},${topY}`
      pathD += ` L${x + vw + dw},${baseY}`
      pathD += ` L${x + vw + dw * 2},${baseY}`
    }
  } else if (pleatType === PleatType.InvertedBox) {
    step = vw + dw * 2
    for (let i = 0; i < n; i++) {
      const x = padX + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${botY}`
      pathD += ` L${x + vw + dw},${botY}`
      pathD += ` L${x + vw + dw},${baseY}`
      pathD += ` L${x + vw + dw * 2},${baseY}`
    }
  } else if (pleatType === PleatType.Accordion) {
    step = vw
    for (let i = 0; i < n; i++) {
      const x = padX + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw * 0.5},${topY}`
      pathD += ` L${x + vw},${baseY}`
    }
  } else if (pleatType === PleatType.Cartridge) {
    step = vw
    for (let i = 0; i < n; i++) {
      const x = padX + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw * 0.3},${baseY}`
      pathD += ` L${x + vw * 0.5},${topY}`
      pathD += ` L${x + vw * 0.7},${baseY}`
      pathD += ` L${x + vw},${baseY}`
    }
  }

  const drawnWidth = n * step
  const totalW = drawnWidth + padX * 2 + (truncated ? 20 : 0)
  const totalH = padTop + foldH * 2 + padBot + 20

  const tickMarks: React.ReactNode[] = []
  for (let i = 0; i <= n; i++) {
    const x = padX + i * step
    tickMarks.push(
      <line key={`tk${i}`} x1={x} y1={baseY - 1.5} x2={x} y2={baseY + 1.5}
        stroke={COLORS.charcoalLight} strokeWidth={0.4} />
    )
  }

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full h-auto" style={maxHeight ? { maxHeight } : undefined}>
      <text x={totalW / 2} y={8} textAnchor="middle" fontSize={4}
        fill={COLORS.charcoal} fontFamily="monospace" fontWeight="600">
        Side Profile — {inputs.pleatType.replace('_', ' ')} pleats
      </text>

      <line x1={padX * 0.4} y1={baseY} x2={padX + drawnWidth + padX * 0.4} y2={baseY}
        stroke={COLORS.sageLight} strokeWidth={0.6} strokeDasharray="3,2" />

      <path d={pathD} fill="none" stroke={COLORS.rose} strokeWidth={2} strokeLinejoin="round" />

      {tickMarks}

      <text x={padX * 0.4 - 2} y={baseY + 1.5} textAnchor="end"
        fontSize={3} fill={COLORS.charcoalLight} fontFamily="monospace">
        waist line
      </text>

      <line x1={padX * 0.4} y1={topY} x2={padX * 0.4 + 12} y2={topY}
        stroke={COLORS.rose} strokeWidth={0.6} strokeDasharray="2,2" opacity={0.5} />
      <text x={padX * 0.4 - 2} y={topY + 1.5} textAnchor="end"
        fontSize={3} fill={COLORS.rose} fontFamily="monospace">
        fold depth
      </text>

      {truncated && (
        <g>
          <text x={padX + drawnWidth + 6} y={baseY + 1.5}
            fontSize={3.5} fill={COLORS.charcoalLight} fontFamily="monospace">
            ×{numberOfPleats}
          </text>
        </g>
      )}

      <text x={totalW / 2} y={totalH - 3} textAnchor="middle"
        fontSize={3} fill={COLORS.charcoalLight} fontFamily="monospace">
        {n} pleats shown · {vw.toFixed(1)} visible + {dw.toFixed(1)} deep each · full width {totalFabricWidth.toFixed(1)}
      </text>
    </svg>
  )
}
