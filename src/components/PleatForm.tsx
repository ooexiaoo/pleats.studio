import { useState, useEffect, useRef } from 'react'
import { PleatType, Unit, PLEAT_TYPE_LABELS, type PleatInputs } from '../types'
import { getDefaultParts } from '../utils/pleatCalculations'

interface PleatFormProps {
  inputs: PleatInputs
  onChange: (inputs: PleatInputs) => void
}

function useFormattedInput(value: number) {
  const [draft, setDraft] = useState(value === 0 ? '' : String(value))
  const committed = useRef(value)

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value
      setDraft(value === 0 ? '' : String(value))
    }
  }, [value])

  return {
    draft,
    setDraft,
    onBlur: () => {
      const num = parseFloat(draft) || 0
      committed.current = num
      setDraft(num === 0 ? '' : String(num))
      return num
    },
  }
}

export default function PleatForm({ inputs, onChange }: PleatFormProps) {
  const [foldsLocked, setFoldsLocked] = useState(true)

  const update = (field: keyof PleatInputs, value: string | number) => {
    onChange({ ...inputs, [field]: value })
  }

  const isBoxType = inputs.pleatType === PleatType.Box || inputs.pleatType === PleatType.InvertedBox

  const updateParts = (field: string, value: number) => {
    const clamped = Math.max(0, value)
    const parts = { ...inputs.pleatParts!, [field]: clamped }
    if (foldsLocked && isBoxType && (field === 'leftFoldDepth' || field === 'rightFoldDepth')) {
      parts.leftFoldDepth = clamped
      parts.rightFoldDepth = clamped
    }
    onChange({ ...inputs, pleatParts: parts })
  }

  const resetToAuto = () => {
    onChange({ ...inputs, pleatParts: getDefaultParts(inputs) })
    setFoldsLocked(true)
  }

  const parts = inputs.pleatParts ?? getDefaultParts(inputs)

  const visibleDraft = useFormattedInput(parts.visibleWidth)
  const leftDraft = useFormattedInput(parts.leftFoldDepth)
  const rightDraft = useFormattedInput(parts.rightFoldDepth)
  const foldDraft = useFormattedInput(parts.foldDepth)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-charcoal">Measurements</h2>
        <div className="flex rounded-full bg-ivory-dark p-0.5">
          {([Unit.Cm, Unit.Inches] as const).map((u) => (
            <button
              key={u}
              onClick={() => update('unit', u)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                inputs.unit === u
                  ? 'bg-rose text-white shadow-sm'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {u === Unit.Cm ? 'cm' : 'in'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-light mb-1.5">
            Waist Circumference ({inputs.unit})
          </label>
          <input
            type="number"
            value={inputs.waistCircumference || ''}
            onChange={(e) => update('waistCircumference', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 72"
            className="w-full px-4 py-3 rounded-xl bg-white border border-ivory-dark
              focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none
              transition-all text-charcoal placeholder:text-charcoal-light/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-light mb-1.5">
            Skirt Length ({inputs.unit})
          </label>
          <input
            type="number"
            value={inputs.skirtLength || ''}
            onChange={(e) => update('skirtLength', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 50"
            className="w-full px-4 py-3 rounded-xl bg-white border border-ivory-dark
              focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none
              transition-all text-charcoal placeholder:text-charcoal-light/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-light mb-1.5">
            Number of Pleats
          </label>
          <input
            type="number"
            value={inputs.numberOfPleats || ''}
            onChange={(e) => update('numberOfPleats', parseInt(e.target.value) || 0)}
            placeholder="e.g. 20"
            min={1}
            className="w-full px-4 py-3 rounded-xl bg-white border border-ivory-dark
              focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none
              transition-all text-charcoal placeholder:text-charcoal-light/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-light mb-1.5">
            Cloth Width ({inputs.unit})
          </label>
          <input
            type="number"
            value={inputs.clothWidth || ''}
            onChange={(e) => update('clothWidth', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 150"
            className="w-full px-4 py-3 rounded-xl bg-white border border-ivory-dark
              focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none
              transition-all text-charcoal placeholder:text-charcoal-light/50"
          />
          <p className="text-xs text-charcoal-light mt-1">Optional — fabric bolt width</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-light mb-1.5">
            Pleat Type
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(PleatType).map((type) => (
              <button
                key={type}
                onClick={() => update('pleatType', type)}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border ${
                  inputs.pleatType === type
                    ? 'bg-rose text-white border-rose shadow-sm'
                    : 'bg-white text-charcoal border-ivory-dark hover:border-rose/40'
                }`}
              >
                {PLEAT_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-ivory-dark pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-charcoal">Pleat Details</h3>
            <button
              onClick={resetToAuto}
              className="text-xs text-rose hover:text-rose-dark transition-colors"
            >
              Reset to Auto
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-charcoal-light mb-1">
                Visible Width per Pleat ({inputs.unit})
              </label>
              <input
                type="number"
                value={visibleDraft.draft}
                onChange={(e) => visibleDraft.setDraft(e.target.value)}
                onBlur={() => updateParts('visibleWidth', visibleDraft.onBlur())}
                step="0.1"
                className="w-full px-3 py-2 rounded-lg bg-ivory border border-ivory-dark text-sm
                  focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none transition-all
                  text-charcoal tabular-nums"
              />
            </div>

            {isBoxType ? (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-charcoal-light mb-1">
                    Left Fold ({inputs.unit})
                  </label>
                  <input
                    type="number"
                    value={leftDraft.draft}
                    onChange={(e) => leftDraft.setDraft(e.target.value)}
                    onBlur={() => updateParts('leftFoldDepth', leftDraft.onBlur())}
                    step="0.1"
                    className="w-full px-3 py-2 rounded-lg bg-ivory border border-ivory-dark text-sm
                      focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none transition-all
                      text-charcoal tabular-nums"
                  />
                </div>
                <button
                  onClick={() => {
                    const next = !foldsLocked
                    setFoldsLocked(next)
                    if (next) {
                      const avg = (parts.leftFoldDepth + parts.rightFoldDepth) / 2
                      updateParts('leftFoldDepth', avg)
                    }
                  }}
                  className="flex-shrink-0 w-8 h-8 mb-0.5 rounded-lg border border-ivory-dark
                    flex items-center justify-center transition-all
                    hover:border-rose/40 active:scale-95"
                  title={foldsLocked ? 'Unlock folds' : 'Lock folds together'}
                >
                  {foldsLocked ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal-light">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <label className="block text-xs text-charcoal-light mb-1">
                    Right Fold ({inputs.unit})
                  </label>
                  <input
                    type="number"
                    value={rightDraft.draft}
                    onChange={(e) => rightDraft.setDraft(e.target.value)}
                    onBlur={() => updateParts('rightFoldDepth', rightDraft.onBlur())}
                    step="0.1"
                    className="w-full px-3 py-2 rounded-lg bg-ivory border border-ivory-dark text-sm
                      focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none transition-all
                      text-charcoal tabular-nums"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-charcoal-light mb-1">
                  Fold Depth ({inputs.unit})
                </label>
                <input
                  type="number"
                  value={foldDraft.draft}
                  onChange={(e) => foldDraft.setDraft(e.target.value)}
                  onBlur={() => updateParts('foldDepth', foldDraft.onBlur())}
                  step="0.1"
                  className="w-full px-3 py-2 rounded-lg bg-ivory border border-ivory-dark text-sm
                    focus:border-rose focus:ring-2 focus:ring-rose/20 outline-none transition-all
                    text-charcoal tabular-nums"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
