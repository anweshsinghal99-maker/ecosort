export type ScanPhase = 'idle' | 'countdown' | 'scanning' | 'analyzing' | 'result' | 'error'

export type PageRoute = 'waste-scanner' | 'dashboard' | 'teach-ai' | 'scan-history' | 'waste-guide' | 'about-project'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface Prediction {
  className: string
  probability: number
}

export interface ClassBreakdown {
  className: string
  displayName: string
  probability: number
  percentage: number
  isPrimary: boolean
  streamColor: 'plastic' | 'paper' | 'metal' | 'uncertain'
}

export interface SOPStep {
  step: number
  title: string
  action: string
  icon: string
}

export interface WasteCategoryGuidance {
  className: string
  displayName: string
  subHeading: string
  icon: string
  stream: string
  binBadge: string
  colorToken: 'plastic' | 'paper' | 'metal' | 'uncertain'
  materialCode: string
  biodegradability: string
  categoryAccuracy: number // e.g. 96.4%
  precisionRating: string // e.g. "97.2% Precision • 95.8% Recall"
  datasetSamplesCount: number // e.g. 1420 samples
  keyOpticalFeatures: string[]
  identification: string
  immediateAction: string
  preparation: string
  nextStage: string
  alternativeRoute?: string
  environmentalTip: string
  impactFact: string
  steps: SOPStep[]
}

export interface ScanRecord {
  id: string
  timestamp: string
  category: string
  displayName: string
  confidence: number
  confidenceLevel: ConfidenceLevel
  predictions: Prediction[]
  guidance: WasteCategoryGuidance
  image?: string
  latencyMs: number
}

export interface SessionStats {
  totalScans: number
  topCategory: string
  topCategoryCount: number
  topCategoryPercentage: number
  itemsIdentified: number
  highConfidenceRate: number
  avgConfidence: number
}

export interface DatasetSample {
  id: string
  category: string
  title: string
  source: string
  imageUrl: string
  thumbnailUrl?: string
}

export interface CategoryTrainingStats {
  className: string
  baselineAccuracy: number
  currentAccuracy: number
  sampleCount: number
  status: 'optimal' | 'improving' | 'calibrated'
}
