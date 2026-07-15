import type { PleatInputs, PleatResults } from '../types'

interface ResultsPanelProps {
  inputs: PleatInputs
  results: PleatResults
}

export default function ResultsPanel({ inputs, results }: ResultsPanelProps) {
  const u = inputs.unit

  const rows = [
    { label: 'Visible Width per Pleat', value: results.visibleWidthPerPleat },
    { label: 'Pleat Depth', value: results.pleatDepth },
    { label: 'Fabric per Pleat', value: results.fabricPerPleat },
    { label: 'Total Fabric Width Needed', value: results.totalFabricWidth },
    { label: 'Fabric Length (skirt length)', value: results.totalFabricLength },
    { label: 'Waist Radius (for circle)', value: results.waistRadius },
    { label: 'Hem Radius', value: results.hemRadius },
    { label: 'Angle per Pleat', value: results.pleatAngle },
  ]

  return (
    <div className="space-y-3">
      <h2 className="text-2xl text-charcoal">Results</h2>
      <div className="bg-white rounded-xl border border-ivory-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory-dark">
              <th className="text-left px-4 py-2.5 font-medium text-charcoal-light">Measurement</th>
              <th className="text-right px-4 py-2.5 font-medium text-charcoal-light">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i < rows.length - 1 ? 'border-b border-ivory-dark/50' : ''}>
                <td className="px-4 py-2.5 text-charcoal">{row.label}</td>
                <td className="px-4 py-2.5 text-right font-medium text-charcoal tabular-nums">
                  {row.value.toFixed(2)} {u === 'cm' ? 'cm' : 'in'}
                </td>
              </tr>
            ))}
            <tr className="border-t border-ivory-dark bg-ivory/50">
              <td className="px-4 py-2.5 text-charcoal font-medium">Fullness Ratio</td>
              <td className="px-4 py-2.5 text-right font-medium text-rose">
                {results.fullnessRatio}x
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
