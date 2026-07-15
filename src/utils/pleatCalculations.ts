import { PleatType, type PleatInputs, type PleatResults } from '../types'

const FULLNESS_RATIOS: Record<PleatType, number> = {
  [PleatType.Knife]: 2,
  [PleatType.Box]: 3,
  [PleatType.InvertedBox]: 3,
  [PleatType.Accordion]: 2,
  [PleatType.Cartridge]: 2,
}

export function calculatePleats(inputs: PleatInputs): PleatResults {
  const { waistCircumference, skirtLength, numberOfPleats, pleatType } = inputs

  const fullnessRatio = FULLNESS_RATIOS[pleatType]
  const visibleWidthPerPleat = waistCircumference / numberOfPleats
  const fabricPerPleat = visibleWidthPerPleat * fullnessRatio
  const pleatDepth = (fabricPerPleat - visibleWidthPerPleat) / 2
  const totalFabricWidth = waistCircumference * fullnessRatio
  const totalFabricLength = skirtLength
  const waistRadius = waistCircumference / (2 * Math.PI)
  const hemRadius = waistRadius + skirtLength
  const pleatAngle = 360 / numberOfPleats

  return {
    visibleWidthPerPleat,
    pleatDepth,
    fabricPerPleat,
    totalFabricWidth,
    totalFabricLength,
    waistRadius,
    hemRadius,
    pleatAngle,
    fullnessRatio,
  }
}

export function formatDimension(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`
}
