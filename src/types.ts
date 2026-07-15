export enum PleatType {
  Knife = 'knife',
  Box = 'box',
  InvertedBox = 'inverted_box',
  Accordion = 'accordion',
  Cartridge = 'cartridge',
}

export enum Unit {
  Cm = 'cm',
  Inches = 'inches',
}

export interface PleatInputs {
  waistCircumference: number
  skirtLength: number
  numberOfPleats: number
  pleatType: PleatType
  unit: Unit
}

export interface PleatResults {
  visibleWidthPerPleat: number
  pleatDepth: number
  fabricPerPleat: number
  totalFabricWidth: number
  totalFabricLength: number
  waistRadius: number
  hemRadius: number
  pleatAngle: number
  fullnessRatio: number
}

export type DiagramTab = 'topdown' | 'flatlay' | 'sideprofile'

export const PLEAT_TYPE_LABELS: Record<PleatType, string> = {
  [PleatType.Knife]: 'Knife (Running)',
  [PleatType.Box]: 'Box Pleats',
  [PleatType.InvertedBox]: 'Inverted Box Pleats',
  [PleatType.Accordion]: 'Accordion Pleats',
  [PleatType.Cartridge]: 'Cartridge Pleats',
}
