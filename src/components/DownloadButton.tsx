import { useRef, useCallback } from 'react'
import type { PleatInputs } from '../types'

interface DownloadButtonProps {
  inputs: PleatInputs
}

export default function DownloadButton({ inputs }: DownloadButtonProps) {
  const downloading = useRef(false)

  const handleDownload = useCallback(async () => {
    const el = document.getElementById('export-layout')
    if (!el || downloading.current) return
    downloading.current = true

    try {
      const { downloadDiagramPng } = await import('../utils/exportUtils')
      const filename = `pleats-${inputs.pleatType}-${inputs.waistCircumference}-${inputs.skirtLength}.png`
      await downloadDiagramPng(el, filename)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      downloading.current = false
    }
  }, [inputs])

  return (
    <button
      onClick={handleDownload}
      className="w-full px-6 py-3 rounded-xl bg-charcoal text-white font-medium
        hover:bg-charcoal/90 active:scale-[0.98] transition-all"
    >
      Download as PNG
    </button>
  )
}
