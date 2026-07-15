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

export default function FlatLay({ inputs, results }: Props) {
  const { numberOfPleats, pleatType } = inputs
  const { totalFabricWidth, totalFabricLength, pleatDepth, visibleWidthPerPleat, waistRadius, hemRadius } = results

  const gap = totalFabricWidth * 0.15
  const circleDiameter = hemRadius * 2
  const totalW = totalFabricWidth + gap + circleDiameter + gap
  const totalH = Math.max(totalFabricLength, circleDiameter) + gap * 2

  const rectX = gap
  const rectY = gap
  const circleCx = gap + totalFabricWidth + gap + circleDiameter / 2
  const circleCy = totalH / 2

  const pleatLines: React.ReactNode[] = []
  for (let i = 0; i <= numberOfPleats; i++) {
    const x = rectX + i * (totalFabricWidth / numberOfPleats)
    const isFold = i < numberOfPleats
    pleatLines.push(
      <line key={`p${i}`}
        x1={x} y1={rectY}
        x2={x} y2={rectY + totalFabricLength}
        stroke={isFold ? COLORS.rose : COLORS.charcoal}
        strokeWidth={isFold ? 0.8 : 1}
        strokeDasharray={isFold ? '4,2' : 'none'}
        opacity={isFold ? 0.6 : 0.8}
      />
    )
    if (isFold) {
      const labelX = x + (totalFabricWidth / numberOfPleats) / 2
      const visibleW = visibleWidthPerPleat
      const depthW = pleatDepth
      if (i === 0) {
        pleatLines.push(
          <text key={`vl${i}`} x={labelX} y={rectY + totalFabricLength + 4}
            textAnchor="middle" fontSize={2.5} fill={COLORS.charcoal} fontFamily="monospace">
            {visibleW.toFixed(1)}
          </text>,
          <text key={`dl${i}`} x={x + 1} y={rectY + totalFabricLength + 8}
            fontSize={2} fill={COLORS.rose} fontFamily="monospace">
            depth: {depthW.toFixed(1)}
          </text>
        )
      }
    }
  }

  const outerPleats: React.ReactNode[] = []
  const degToRad = (d: number) => (d * Math.PI) / 180
  for (let i = 0; i < numberOfPleats; i++) {
    const angle = degToRad(i * results.pleatAngle)
    const x1 = circleCx + waistRadius * Math.cos(angle)
    const y1 = circleCy + waistRadius * Math.sin(angle)
    const x2 = circleCx + hemRadius * Math.cos(angle)
    const y2 = circleCy + hemRadius * Math.sin(angle)
    outerPleats.push(
      <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={COLORS.charcoal} strokeWidth={0.4} opacity={0.3} />
    )
  }

  const showPleatDetail = pleatType === PleatType.Knife || pleatType === PleatType.Accordion
  const foldIndicators: React.ReactNode[] = []
  if (showPleatDetail) {
    for (let i = 0; i < numberOfPleats && i < 6; i++) {
      const x = rectX + i * (totalFabricWidth / numberOfPleats)
      const w = totalFabricWidth / numberOfPleats
      const foldX = x + w * 0.35
      foldIndicators.push(
        <path key={`fi${i}`}
          d={`M${x},${rectY} L${foldX},${rectY + totalFabricLength * 0.15} L${x + w * 0.7},${rectY}`}
          fill="none" stroke={COLORS.sage} strokeWidth={0.6} opacity={0.5} />
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
    >
      <defs>
        <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="white" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="#eee" strokeWidth="0.3" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="#eee" strokeWidth="0.3" />
        </pattern>
      </defs>

      <rect x={rectX} y={rectY} width={totalFabricWidth} height={totalFabricLength}
        fill="url(#fabricTexture)" stroke={COLORS.charcoal} strokeWidth={1} rx={0.5} />

      {pleatLines}
      {foldIndicators}

      <text x={rectX + totalFabricWidth / 2} y={rectY - 3}
        textAnchor="middle" fontSize={3} fill={COLORS.charcoal}
        fontFamily="monospace" fontWeight="600">
        Flat Fabric — {totalFabricWidth.toFixed(1)} × {totalFabricLength.toFixed(1)}
      </text>
      <text x={rectX + totalFabricWidth / 2} y={rectY + totalFabricLength + 13}
        textAnchor="middle" fontSize={2.5} fill={COLORS.charcoalLight}
        fontFamily="monospace">
        {inputs.numberOfPleats} × {inputs.pleatType.replace('_', ' ')} pleats
      </text>

      <g>
        <circle cx={circleCx} cy={circleCy} r={hemRadius}
          fill={COLORS.sageLight} fillOpacity={0.2}
          stroke={COLORS.charcoal} strokeWidth={0.5} />
        <circle cx={circleCx} cy={circleCy} r={waistRadius}
          fill="white" stroke={COLORS.charcoal} strokeWidth={0.8} />
        {outerPleats}
        <circle cx={circleCx} cy={circleCy} r={1.5} fill={COLORS.charcoal} />
        <text x={circleCx} y={circleCy - hemRadius - 3}
          textAnchor="middle" fontSize={3} fill={COLORS.charcoal}
          fontFamily="monospace" fontWeight="600">
          Assembled Skirt
        </text>
      </g>

      <g>
        <defs>
          <marker id="arrowHead" markerWidth="4" markerHeight="3" refX="2" refY="1.5" orient="auto">
            <polygon points="0,0 4,1.5 0,3" fill={COLORS.charcoalLight} />
          </marker>
        </defs>
        <line
          x1={rectX + totalFabricWidth + gap * 0.3}
          y1={circleCy}
          x2={circleCx - hemRadius - gap * 0.3}
          y2={circleCy}
          stroke={COLORS.charcoalLight} strokeWidth={0.8}
          markerEnd="url(#arrowHead)"
          strokeDasharray="3,2"
        />
      </g>
    </svg>
  )
}
