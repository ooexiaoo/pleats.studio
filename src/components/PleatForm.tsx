import { PleatType, Unit, PLEAT_TYPE_LABELS, type PleatInputs } from '../types'

interface PleatFormProps {
  inputs: PleatInputs
  onChange: (inputs: PleatInputs) => void
}

export default function PleatForm({ inputs, onChange }: PleatFormProps) {
  const update = (field: keyof PleatInputs, value: string | number) => {
    onChange({ ...inputs, [field]: value })
  }

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
      </div>
    </div>
  )
}
