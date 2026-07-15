import { PleatType, type PleatInputs, type PleatResults, type PleatParts } from '../types'

const FULLNESS_RATIOS: Record<PleatType, number> = {
  [PleatType.Knife]: 2,
  [PleatType.Box]: 3,
  [PleatType.InvertedBox]: 3,
  [PleatType.Accordion]: 2,
  [PleatType.Cartridge]: 2,
}

const round4 = (n: number) => Math.round(n * 10000) / 10000

export function getDefaultParts(inputs: PleatInputs): PleatParts {
  const { waistCircumference, numberOfPleats, pleatType } = inputs
  const fullnessRatio = FULLNESS_RATIOS[pleatType]
  const visibleWidth = numberOfPleats > 0 ? waistCircumference / numberOfPleats : 0
  const fabricPerPleat = visibleWidth * fullnessRatio
  const totalFold = fabricPerPleat - visibleWidth

  if (pleatType === PleatType.Box || pleatType === PleatType.InvertedBox) {
    return {
      visibleWidth: round4(visibleWidth),
      foldDepth: 0,
      leftFoldDepth: round4(totalFold / 2),
      rightFoldDepth: round4(totalFold / 2),
    }
  }

  return {
    visibleWidth: round4(visibleWidth),
    foldDepth: round4(totalFold / 2),
    leftFoldDepth: 0,
    rightFoldDepth: 0,
  }
}

export function calculatePleats(inputs: PleatInputs): PleatResults {
  const { waistCircumference, skirtLength, numberOfPleats, pleatType, clothWidth, pleatParts } = inputs

  const fullnessRatio = FULLNESS_RATIOS[pleatType]
  const defaults = getDefaultParts(inputs)
  const parts = pleatParts ?? defaults

  const isBoxType = pleatType === PleatType.Box || pleatType === PleatType.InvertedBox

  const visibleWidthPerPleat = Math.max(0, parts.visibleWidth)
  const leftFoldDepth = isBoxType ? Math.max(0, parts.leftFoldDepth) : Math.max(0, parts.foldDepth)
  const rightFoldDepth = isBoxType ? Math.max(0, parts.rightFoldDepth) : 0
  const pleatDepth = leftFoldDepth

  const fabricPerPleat = visibleWidthPerPleat + leftFoldDepth + rightFoldDepth
  const totalFabricWidth = fabricPerPleat * numberOfPleats
  const totalFabricLength = skirtLength
  const waistRadius = waistCircumference / (2 * Math.PI)
  const hemRadius = waistRadius + skirtLength
  const hemCircumference = hemRadius * 2 * Math.PI
  const pleatAngle = 360 / numberOfPleats

  const clothSufficient = clothWidth <= 0 || totalFabricWidth <= clothWidth
  const clothShortfall = clothSufficient ? 0 : totalFabricWidth - clothWidth

  const warnings: string[] = []
  if (numberOfPleats > 0 && Math.abs(visibleWidthPerPleat * numberOfPleats - waistCircumference) > 0.01) {
    warnings.push(`Visible width (${visibleWidthPerPleat.toFixed(1)}) × ${numberOfPleats} = ${(visibleWidthPerPleat * numberOfPleats).toFixed(1)}, doesn't match waist (${waistCircumference.toFixed(1)})`)
  }

  return {
    visibleWidthPerPleat,
    pleatDepth,
    leftFoldDepth,
    rightFoldDepth,
    fabricPerPleat,
    totalFabricWidth,
    totalFabricLength,
    waistRadius,
    hemRadius,
    hemCircumference,
    pleatAngle,
    fullnessRatio,
    clothSufficient,
    clothShortfall,
    warnings,
  }
}

export function formatDimension(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`
}
