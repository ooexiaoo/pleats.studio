import { PleatType } from '../../types'
import type { PleatInputs, PleatResults } from '../../types'

interface Props {
  inputs: PleatInputs
  results: PleatResults
}

const COLORS = {
  ivory: '#FAF7F2',
  charcoal: '#2D2926',
  charcoalLight: '#5A5450',
  rose: '#C4727F',
  sage: '#8FA68A',
  sageLight: '#B3C9AF',
}

export default function TopDownCircle({ inputs, results }: Props) {
  const { waistRadius, hemRadius, pleatAngle } = results
  const { numberOfPleats, pleatType } = inputs

  const pad = hemRadius * 0.3
  const totalSize = (hemRadius + pad) * 2
  const center = totalSize / 2

  const pleats: React.ReactNode[] = []
  const degToRad = (d: number) => (d * Math.PI) / 180

  if (pleatType === PleatType.Knife) {
    for (let i = 0; i < numberOfPleats; i++) {
      const angle = degToRad(i * pleatAngle)
      const x1 = center + waistRadius * Math.cos(angle)
      const y1 = center + waistRadius * Math.sin(angle)
      const x2 = center + hemRadius * Math.cos(angle)
      const y2 = center + hemRadius * Math.sin(angle)

      const foldAngle = degToRad(i * pleatAngle + pleatAngle * 0.35)
      const foldDepth = results.pleatDepth * 0.6
      const fx = center + (waistRadius + foldDepth) * Math.cos(foldAngle)
      const fy = center + (waistRadius + foldDepth) * Math.sin(foldAngle)
      const fx2 = center + (hemRadius * 0.85) * Math.cos(foldAngle)
      const fy2 = center + (hemRadius * 0.85) * Math.sin(foldAngle)

      pleats.push(
        <line key={`f${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={COLORS.charcoal} strokeWidth={0.8} opacity={0.6} />,
        <path key={`d${i}`}
          d={`M${x1},${y1} Q${fx},${fy} ${fx2},${fy2}`}
          fill="none" stroke={COLORS.rose} strokeWidth={0.6}
          strokeDasharray="2,2" opacity={0.5} />
      )
    }
  } else if (pleatType === PleatType.Box || pleatType === PleatType.InvertedBox) {
    const isInverted = pleatType === PleatType.InvertedBox
    for (let i = 0; i < numberOfPleats; i++) {
      const baseAngle = degToRad(i * pleatAngle)
      const offset = degToRad(pleatAngle * 0.15)

      const a1 = baseAngle - offset
      const a2 = baseAngle + offset

      const x1a = center + waistRadius * Math.cos(a1)
      const y1a = center + waistRadius * Math.sin(a1)
      const x2a = center + hemRadius * Math.cos(a1)
      const y2a = center + hemRadius * Math.sin(a1)
      const x1b = center + waistRadius * Math.cos(a2)
      const y1b = center + waistRadius * Math.sin(a2)
      const x2b = center + hemRadius * Math.cos(a2)
      const y2b = center + hemRadius * Math.sin(a2)

      const midAngle = degToRad(i * pleatAngle)
      const foldDir = isInverted ? -1 : 1
      const foldDepth = results.pleatDepth * 0.5 * foldDir

      const mx1 = center + (waistRadius + foldDepth) * Math.cos(midAngle)
      const my1 = center + (waistRadius + foldDepth) * Math.sin(midAngle)
      const mx2 = center + (hemRadius * 0.9 + foldDepth) * Math.cos(midAngle)
      const my2 = center + (hemRadius * 0.9 + foldDepth) * Math.sin(midAngle)

      pleats.push(
        <line key={`l${i}`} x1={x1a} y1={y1a} x2={x2a} y2={y2a}
          stroke={COLORS.charcoal} strokeWidth={0.8} opacity={0.6} />,
        <line key={`r${i}`} x1={x1b} y1={y1b} x2={x2b} y2={y2b}
          stroke={COLORS.charcoal} strokeWidth={0.8} opacity={0.6} />,
        <line key={`m${i}`} x1={mx1} y1={my1} x2={mx2} y2={my2}
          stroke={COLORS.rose} strokeWidth={0.6}
          strokeDasharray="3,2" opacity={0.5} />
      )
    }
  } else if (pleatType === PleatType.Accordion) {
    for (let i = 0; i < numberOfPleats; i++) {
      const a1 = degToRad(i * pleatAngle)
      const a2 = degToRad(i * pleatAngle + pleatAngle * 0.5)

      const x1 = center + waistRadius * Math.cos(a1)
      const y1 = center + waistRadius * Math.sin(a1)
      const x2 = center + hemRadius * Math.cos(a1)
      const y2 = center + hemRadius * Math.sin(a1)

      const mx = center + (waistRadius + results.pleatDepth * 0.4) * Math.cos(a2)
      const my = center + (waistRadius + results.pleatDepth * 0.4) * Math.sin(a2)

      pleats.push(
        <line key={`a${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={COLORS.charcoal} strokeWidth={0.8} opacity={0.6} />,
        <circle key={`d${i}`} cx={mx} cy={my} r={1}
          fill={COLORS.rose} opacity={0.5} />
      )
    }
  } else if (pleatType === PleatType.Cartridge) {
    for (let i = 0; i < numberOfPleats; i++) {
      const angle = degToRad(i * pleatAngle)
      const x1 = center + waistRadius * Math.cos(angle)
      const y1 = center + waistRadius * Math.sin(angle)
      const x2 = center + hemRadius * Math.cos(angle)
      const y2 = center + hemRadius * Math.sin(angle)

      const gx = center + (waistRadius + 2) * Math.cos(angle)
      const gy = center + (waistRadius + 2) * Math.sin(angle)

      pleats.push(
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={COLORS.sage} strokeWidth={0.4} opacity={0.3} />,
        <circle key={`g${i}`} cx={gx} cy={gy} r={1.5}
          fill={COLORS.rose} opacity={0.7} />
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      className="w-full h-auto"
    >
      <circle cx={center} cy={center} r={hemRadius}
        fill={COLORS.sageLight} fillOpacity={0.3}
        stroke={COLORS.charcoal} strokeWidth={0.5} />
      <circle cx={center} cy={center} r={waistRadius}
        fill="white" stroke={COLORS.charcoal} strokeWidth={1} />
      {pleats}
      <circle cx={center} cy={center} r={2} fill={COLORS.charcoal} />
      <DimensionLine
        x1={center} y1={center}
        x2={center + waistRadius} y2={center}
        label={`r = ${waistRadius.toFixed(1)}`}
        color={COLORS.charcoal}
        offset={-4}
      />
      <DimensionLine
        x1={center + waistRadius} y1={center}
        x2={center + hemRadius} y2={center}
        label={`L = ${results.totalFabricLength.toFixed(1)}`}
        color={COLORS.rose}
        offset={-4}
      />
      <text x={center} y={center + hemRadius + 6} textAnchor="middle"
        fontSize={2.8} fill={COLORS.charcoalLight} fontFamily="monospace">
        hem ⌀ {results.hemCircumference.toFixed(1)}
      </text>
    </svg>
  )
}

function DimensionLine({ x1, y1, x2, y2, label, color, offset }: {
  x1: number; y1: number; x2: number; y2: number
  label: string; color: string; offset: number
}) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <g>
      <line x1={x1} y1={y1 + offset} x2={x2} y2={y2 + offset}
        stroke={color} strokeWidth={0.5} />
      <line x1={x1} y1={y1 + offset - 1.5} x2={x1} y2={y1 + offset + 1.5}
        stroke={color} strokeWidth={0.5} />
      <line x1={x2} y1={y2 + offset - 1.5} x2={x2} y2={y2 + offset + 1.5}
        stroke={color} strokeWidth={0.5} />
      <text x={mx} y={my + offset - 2} textAnchor="middle"
        fontSize={3} fill={color} fontFamily="monospace">
        {label}
      </text>
    </g>
  )
}
