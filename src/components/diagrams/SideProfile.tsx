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

function DimLine({ x1, x2, y, label, side = 'bottom' }: {
  x1: number; x2: number; y: number; label: string; side?: 'top' | 'bottom'
}) {
  const tickH = 1.2
  const labelY = side === 'bottom' ? y + 2.5 : y - 1.5
  const lineY = side === 'bottom' ? y + 1 : y - 1
  return (
    <g>
      <line x1={x1} y1={y - tickH} x2={x1} y2={y + tickH}
        stroke={COLORS.charcoalLight} strokeWidth={0.3} />
      <line x1={x2} y1={y - tickH} x2={x2} y2={y + tickH}
        stroke={COLORS.charcoalLight} strokeWidth={0.3} />
      <line x1={x1} y1={lineY} x2={x2} y2={lineY}
        stroke={COLORS.charcoalLight} strokeWidth={0.3} />
      <text x={(x1 + x2) / 2} y={labelY} textAnchor="middle"
        fontSize={2.2} fill={COLORS.charcoalLight} fontFamily="monospace">
        {label}
      </text>
    </g>
  )
}

export default function SideProfile({ inputs, results, maxHeight }: Props) {
  const { numberOfPleats, pleatType } = inputs
  const { visibleWidthPerPleat, leftFoldDepth, rightFoldDepth, totalFabricWidth } = results

  const n = Math.min(numberOfPleats, MAX_SHOW)
  const truncated = numberOfPleats > MAX_SHOW

  const vw = visibleWidthPerPleat
  const lf = leftFoldDepth
  const rf = rightFoldDepth

  const maxFold = Math.max(lf, rf)
  const foldH = maxFold * 15
  const padLeft = 30
  const padRight = truncated ? 30 : 16
  const padTop = 12
  const padBot = 14

  const baseY = padTop + foldH + 4
  const topY = baseY - foldH
  const botY = baseY + foldH

  let step = 0
  let pathD = ''

  if (pleatType === PleatType.Knife) {
    step = vw + lf
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${topY}`
      pathD += ` L${x + vw + lf},${topY}`
      pathD += ` L${x + vw + lf},${baseY}`
    }
  } else if (pleatType === PleatType.Box) {
    step = vw + lf + rf
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${topY}`
      pathD += ` L${x + vw + lf},${topY}`
      pathD += ` L${x + vw + lf},${baseY}`
      pathD += ` L${x + vw + lf + rf},${baseY}`
    }
  } else if (pleatType === PleatType.InvertedBox) {
    step = vw + lf + rf
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw},${baseY}`
      pathD += ` L${x + vw},${botY}`
      pathD += ` L${x + vw + lf},${botY}`
      pathD += ` L${x + vw + lf},${baseY}`
      pathD += ` L${x + vw + lf + rf},${baseY}`
    }
  } else if (pleatType === PleatType.Accordion) {
    step = vw + lf
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw * 0.5},${topY}`
      pathD += ` L${x + vw},${baseY}`
    }
  } else if (pleatType === PleatType.Cartridge) {
    step = vw + lf
    for (let i = 0; i < n; i++) {
      const x = padLeft + i * step
      if (i === 0) pathD += `M${x},${baseY}`
      pathD += ` L${x + vw * 0.3},${baseY}`
      pathD += ` L${x + vw * 0.5},${topY}`
      pathD += ` L${x + vw * 0.7},${baseY}`
      pathD += ` L${x + vw},${baseY}`
    }
  }

  const drawnWidth = n * step
  const totalW = padLeft + drawnWidth + padRight
  const totalH = padTop + foldH * 2 + padBot + 18

  const tickMarks: React.ReactNode[] = []
  for (let i = 0; i <= n; i++) {
    const x = padLeft + i * step
    tickMarks.push(
      <line key={`tk${i}`} x1={x} y1={baseY - 1.5} x2={x} y2={baseY + 1.5}
        stroke={COLORS.charcoalLight} strokeWidth={0.4} />
    )
  }

  const firstX = padLeft

  const annotations: React.ReactNode[] = []

  if (pleatType === PleatType.Knife || pleatType === PleatType.Accordion || pleatType === PleatType.Cartridge) {
    annotations.push(
      <DimLine key="vw" x1={firstX} x2={firstX + vw} y={baseY} label={`${vw.toFixed(1)}`} side="bottom" />,
      <DimLine key="fd" x1={firstX + vw} x2={firstX + vw + lf} y={topY} label={`${lf.toFixed(1)}`} side="top" />,
    )
  } else if (pleatType === PleatType.Box || pleatType === PleatType.InvertedBox) {
    const foldY = pleatType === PleatType.Box ? topY : botY
    annotations.push(
      <DimLine key="vw" x1={firstX} x2={firstX + vw} y={baseY} label={`${vw.toFixed(1)}`} side="bottom" />,
      <DimLine key="lf" x1={firstX + vw} x2={firstX + vw + lf} y={foldY} label={`${lf.toFixed(1)}`} side={pleatType === PleatType.Box ? 'top' : 'bottom'} />,
      <DimLine key="rf" x1={firstX + vw + lf} x2={firstX + vw + lf + rf} y={foldY} label={`${rf.toFixed(1)}`} side={pleatType === PleatType.Box ? 'top' : 'bottom'} />,
    )
  }

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full h-auto" style={maxHeight ? { maxHeight } : undefined}>
      <text x={totalW / 2} y={7} textAnchor="middle" fontSize={3.5}
        fill={COLORS.charcoal} fontFamily="monospace" fontWeight="600">
        Side Profile — {inputs.pleatType.replace('_', ' ')} pleats
      </text>

      <line x1={padLeft - 4} y1={baseY} x2={padLeft + drawnWidth + 4} y2={baseY}
        stroke={COLORS.sageLight} strokeWidth={0.6} strokeDasharray="3,2" />

      <path d={pathD} fill="none" stroke={COLORS.rose} strokeWidth={3} strokeLinejoin="round" />

      {tickMarks}
      {annotations}

      <text x={padLeft - 6} y={baseY + 1.5} textAnchor="end"
        fontSize={2.8} fill={COLORS.charcoalLight} fontFamily="monospace">
        waist
      </text>

      <line x1={padLeft - 4} y1={topY} x2={padLeft + 8} y2={topY}
        stroke={COLORS.rose} strokeWidth={0.6} strokeDasharray="2,2" opacity={0.5} />
      <text x={padLeft - 6} y={topY + 1.5} textAnchor="end"
        fontSize={2.8} fill={COLORS.rose} fontFamily="monospace">
        fold
      </text>

      {truncated && (
        <text x={padLeft + drawnWidth + 6} y={baseY + 1.5}
          fontSize={3.5} fill={COLORS.charcoalLight} fontFamily="monospace">
          ×{numberOfPleats}
        </text>
      )}

      <text x={totalW / 2} y={totalH - 3} textAnchor="middle"
        fontSize={2.5} fill={COLORS.charcoalLight} fontFamily="monospace">
        {n} pleats · {vw.toFixed(1)} visible + {lf.toFixed(1)}{rf > 0 ? `+${rf.toFixed(1)}` : ''} deep · width {totalFabricWidth.toFixed(1)}
      </text>
    </svg>
  )
}
