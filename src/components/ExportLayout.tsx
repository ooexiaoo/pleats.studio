import type { PleatInputs, PleatResults } from '../types'
import TopDownCircle from './diagrams/TopDownCircle'
import FlatLay from './diagrams/FlatLay'
import SideProfile from './diagrams/SideProfile'

interface Props {
  inputs: PleatInputs
  results: PleatResults
}

const C = {
  ivory: '#FAF7F2',
  ivoryDark: '#F0EBE3',
  charcoal: '#2D2926',
  charcoalLight: '#5A5450',
  rose: '#C4727F',
}

const W = 1200
const H = Math.round(W * 1.4142)

export default function ExportLayout({ inputs, results }: Props) {
  const u = inputs.unit === 'cm' ? 'cm' : 'in'

  const leftRows: [string, string][] = [
    ['Waist Circumference', `${inputs.waistCircumference} ${u}`],
    ['Skirt Length', `${inputs.skirtLength} ${u}`],
    ['Number of Pleats', `${inputs.numberOfPleats}`],
    ['Pleat Type', inputs.pleatType.replace('_', ' ')],
    ['Cloth Width', inputs.clothWidth > 0 ? `${inputs.clothWidth} ${u}` : 'Not specified'],
    ['Fullness Ratio', `${results.fullnessRatio}x`],
  ]

  const rightRows: [string, string][] = [
    ['Visible Width / Pleat', `${results.visibleWidthPerPleat.toFixed(2)} ${u}`],
    ['Pleat Depth', `${results.pleatDepth.toFixed(2)} ${u}`],
    ['Fabric / Pleat', `${results.fabricPerPleat.toFixed(2)} ${u}`],
    ['Total Fabric Width', `${results.totalFabricWidth.toFixed(2)} ${u}`],
    ['Fabric Length', `${results.totalFabricLength.toFixed(2)} ${u}`],
    ['Waist Radius', `${results.waistRadius.toFixed(2)} ${u}`],
    ['Hem Radius', `${results.hemRadius.toFixed(2)} ${u}`],
    ['Hem Circumference', `${results.hemCircumference.toFixed(2)} ${u}`],
    ['Angle / Pleat', `${results.pleatAngle.toFixed(2)}°`],
  ]

  const card: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    border: `1px solid ${C.ivoryDark}`,
    overflow: 'hidden',
  }

  const th: React.CSSProperties = {
    textAlign: 'left',
    padding: '6px 12px',
    fontWeight: 500,
    color: C.charcoalLight,
    fontSize: '11px',
    borderBottom: `1px solid ${C.ivoryDark}`,
  }

  const thR: React.CSSProperties = { ...th, textAlign: 'right' }

  const td: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    color: C.charcoal,
  }

  const tdR: React.CSSProperties = {
    ...td,
    textAlign: 'right',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  }

  const label: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: C.charcoalLight,
    margin: 0,
    padding: '8px 14px',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: `1px solid ${C.ivoryDark}`,
  }

  return (
    <div
      id="export-layout"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        width: `${W}px`,
        height: `${H}px`,
        background: C.ivory,
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: C.charcoal,
        padding: '36px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: '34px',
            margin: 0,
            color: C.charcoal,
            letterSpacing: '-0.5px',
          }}>
            Pleats
          </h1>
          <p style={{ fontSize: '13px', color: C.charcoalLight, margin: '2px 0 0' }}>
            {inputs.pleatType.replace('_', ' ')} · {inputs.waistCircumference}{u} waist · {inputs.skirtLength}{u} length · {inputs.numberOfPleats} pleats
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
        <div style={{ ...card, flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Input</th>
                <th style={thR}>Value</th>
              </tr>
            </thead>
            <tbody>
              {leftRows.map(([l, v], i) => (
                <tr key={i} style={{ borderBottom: i < leftRows.length - 1 ? `1px solid ${C.ivoryDark}50` : undefined }}>
                  <td style={td}>{l}</td>
                  <td style={tdR}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Calculated</th>
                <th style={thR}>Value</th>
              </tr>
            </thead>
            <tbody>
              {rightRows.map(([l, v], i) => (
                <tr key={i} style={{ borderBottom: i < rightRows.length - 1 ? `1px solid ${C.ivoryDark}50` : undefined }}>
                  <td style={td}>{l}</td>
                  <td style={tdR}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', height: '520px' }}>
        <div style={{ ...card, flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
          <p style={label}>Top View</p>
          <div style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TopDownCircle inputs={inputs} results={results} />
          </div>
        </div>
        <div style={{ ...card, flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
          <p style={label}>Flat Lay</p>
          <div style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlatLay inputs={inputs} results={results} />
          </div>
        </div>
      </div>

      <div style={{ ...card, marginTop: '12px', height: '320px', display: 'flex', flexDirection: 'column' }}>
        <p style={label}>Side Profile</p>
        <div style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ width: '100%' }}>
            <SideProfile inputs={inputs} results={results} maxHeight="270px" />
          </div>
        </div>
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: '10px',
        color: C.charcoalLight,
        opacity: 0.4,
        margin: '10px 0 0',
      }}>
        Generated with Pleats
      </p>
    </div>
  )
}
