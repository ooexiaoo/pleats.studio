import { useState, useCallback } from 'react'
import type { DiagramTab, PleatInputs, PleatResults } from '../types'
import TopDownCircle from './diagrams/TopDownCircle'
import FlatLay from './diagrams/FlatLay'
import SideProfile from './diagrams/SideProfile'

interface DiagramViewerProps {
  inputs: PleatInputs
  results: PleatResults
}

const TABS: { key: DiagramTab; label: string }[] = [
  { key: 'topdown', label: 'Top View' },
  { key: 'flatlay', label: 'Flat Lay' },
  { key: 'sideprofile', label: 'Side Profile' },
]

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]

export default function DiagramViewer({ inputs, results }: DiagramViewerProps) {
  const [activeTab, setActiveTab] = useState<DiagramTab>('topdown')
  const [zoomIndex, setZoomIndex] = useState(2)

  const zoom = ZOOM_LEVELS[zoomIndex]

  const zoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(i - 1, 0))
  }, [])

  const zoomReset = useCallback(() => {
    setZoomIndex(2)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-ivory-dark rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-ivory-dark rounded-xl p-1">
          <button onClick={zoomOut} disabled={zoomIndex === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-light
              hover:bg-white hover:text-charcoal disabled:opacity-30 disabled:hover:bg-transparent
              transition-all text-lg font-medium">
            −
          </button>
          <button onClick={zoomReset}
            className="px-2 h-8 rounded-lg flex items-center justify-center text-charcoal-light
              hover:bg-white hover:text-charcoal transition-all text-xs font-mono tabular-nums min-w-[3rem]">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={zoomIn} disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-light
              hover:bg-white hover:text-charcoal disabled:opacity-30 disabled:hover:bg-transparent
              transition-all text-lg font-medium">
            +
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ivory-dark overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: '75vh' }}>
          <div className="p-6 flex flex-col items-center" style={{ minWidth: 'min-content' }}>
            <div
              className="mb-4 transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              {activeTab === 'topdown' && <TopDownCircle inputs={inputs} results={results} />}
              {activeTab === 'flatlay' && <FlatLay inputs={inputs} results={results} />}
              {activeTab === 'sideprofile' && <SideProfile inputs={inputs} results={results} />}
            </div>
            <DimensionSummary inputs={inputs} results={results} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DimensionSummary({ inputs, results }: { inputs: PleatInputs; results: PleatResults }) {
  const u = inputs.unit === 'cm' ? 'cm' : 'in'
  const items = [
    `Waist: ${inputs.waistCircumference}${u}`,
    `Length: ${inputs.skirtLength}${u}`,
    `Pleats: ${inputs.numberOfPleats}`,
    `Type: ${inputs.pleatType.replace('_', ' ')}`,
    `Fabric Width: ${results.totalFabricWidth.toFixed(1)}${u}`,
    `Hem ⌀: ${results.hemCircumference.toFixed(1)}${u}`,
    `Pleat Depth: ${results.pleatDepth.toFixed(1)}${u}`,
    `Visible/pleat: ${results.visibleWidthPerPleat.toFixed(1)}${u}`,
  ]

  return (
    <div className="w-full text-xs text-charcoal-light text-center leading-relaxed font-mono">
      {items.join('  ·  ')}
    </div>
  )
}
