import { useState, useRef, useCallback } from 'react'
import { PleatType, Unit, type PleatInputs, type PleatResults } from './types'
import { calculatePleats } from './utils/pleatCalculations'
import { downloadDiagramPng } from './utils/exportUtils'
import PleatForm from './components/PleatForm'
import ResultsPanel from './components/ResultsPanel'
import DiagramViewer from './components/DiagramViewer'
import ExportLayout from './components/ExportLayout'

const DEFAULT_INPUTS: PleatInputs = {
  waistCircumference: 72,
  skirtLength: 50,
  numberOfPleats: 20,
  pleatType: PleatType.Knife,
  unit: Unit.Cm,
}

export default function App() {
  const [inputs, setInputs] = useState<PleatInputs>(DEFAULT_INPUTS)
  const [showExport, setShowExport] = useState(false)
  const downloading = useRef(false)

  const results: PleatResults = calculatePleats(inputs)

  const handleDownload = useCallback(async () => {
    if (downloading.current) return
    downloading.current = true
    setShowExport(true)

    await new Promise((r) => setTimeout(r, 50))
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    try {
      const el = document.getElementById('export-layout')
      if (el) {
        const filename = `pleats-${inputs.pleatType}-${inputs.waistCircumference}-${inputs.skirtLength}.png`
        await downloadDiagramPng(el, filename)
      }
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setShowExport(false)
      downloading.current = false
    }
  }, [inputs])

  return (
    <div className="min-h-screen bg-ivory">
      {showExport && <ExportLayout inputs={inputs} results={results} />}

      <header className="border-b border-ivory-dark bg-ivory/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl text-charcoal tracking-tight">Pleats</h1>
          <p className="text-sm text-charcoal-light hidden sm:block">Skirt pleat calculator</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-ivory-dark p-6">
              <PleatForm inputs={inputs} onChange={setInputs} />
            </div>
            <div className="bg-white rounded-2xl border border-ivory-dark p-6">
              <ResultsPanel inputs={inputs} results={results} />
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading.current}
              className="w-full px-6 py-3 rounded-xl bg-charcoal text-white font-medium
                hover:bg-charcoal/90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {downloading.current ? 'Generating...' : 'Download as PNG'}
            </button>
          </aside>

          <section className="lg:col-span-8">
            <DiagramViewer inputs={inputs} results={results} />
          </section>
        </div>
      </main>

      <footer className="border-t border-ivory-dark py-6 text-center text-sm text-charcoal-light">
        Pleats — a skirt pleat calculator
      </footer>
    </div>
  )
}
