import { PleatType } from '../types'
import type { PleatInputs, PleatResults } from '../types'

interface ResultsPanelProps {
  inputs: PleatInputs
  results: PleatResults
}

export default function ResultsPanel({ inputs, results }: ResultsPanelProps) {
  const u = inputs.unit === 'cm' ? 'cm' : 'in'
  const isBoxType = inputs.pleatType === PleatType.Box || inputs.pleatType === PleatType.InvertedBox

  const rows = [
    { label: 'Visible Width per Pleat', value: results.visibleWidthPerPleat },
    ...(isBoxType
      ? [
          { label: 'Left Fold Depth', value: results.leftFoldDepth },
          { label: 'Right Fold Depth', value: results.rightFoldDepth },
        ]
      : [{ label: 'Fold Depth', value: results.pleatDepth }]),
    { label: 'Fabric per Pleat', value: results.fabricPerPleat },
    { label: 'Total Fabric Width Needed', value: results.totalFabricWidth },
    { label: 'Fabric Length (skirt length)', value: results.totalFabricLength },
    { label: 'Waist Radius (for circle)', value: results.waistRadius },
    { label: 'Hem Radius', value: results.hemRadius },
    { label: 'Hem Circumference', value: results.hemCircumference },
    { label: 'Angle per Pleat', value: results.pleatAngle },
  ]

  return (
    <div className="space-y-3">
      <h2 className="text-2xl text-charcoal">Results</h2>

      {results.warnings.length > 0 && (
        <div className="space-y-2">
          {results.warnings.map((w, i) => (
            <div key={i} className="px-4 py-3 rounded-xl text-sm font-medium border bg-rose/10 border-rose/30 text-rose-dark">
              {w}
            </div>
          ))}
        </div>
      )}

      {inputs.clothWidth > 0 && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
          results.clothSufficient
            ? 'bg-sage/10 border-sage/30 text-sage-dark'
            : 'bg-rose/10 border-rose/30 text-rose-dark'
        }`}>
          {results.clothSufficient ? (
            <span>Your {inputs.clothWidth}{u} cloth is enough — needs {results.totalFabricWidth.toFixed(1)}{u}</span>
          ) : (
            <span>Needs {results.totalFabricWidth.toFixed(1)}{u} — your cloth is {results.clothShortfall.toFixed(1)}{u} short</span>
          )}
        </div>
      )}

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
                  {row.value.toFixed(2)} {u}
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
