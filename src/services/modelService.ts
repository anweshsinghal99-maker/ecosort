import * as tmImage from '@teachablemachine/image'
import type { Prediction } from '../types'

const MODEL_URL = '/model/model.json'
const METADATA_URL = '/model/metadata.json'

let modelInstance: tmImage.CustomMobileNet | null = null
let modelLoadingPromise: Promise<tmImage.CustomMobileNet> | null = null
let trainedLabels: string[] = []

export async function loadWasteModel(): Promise<tmImage.CustomMobileNet> {
  if (modelInstance) {
    return modelInstance
  }

  if (modelLoadingPromise) {
    return modelLoadingPromise
  }

  modelLoadingPromise = (async () => {
    try {
      console.info('[EcoSort AI] Initializing Teachable Machine model from local assets...')
      const startTime = performance.now()
      
      const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL)
      const loadDuration = (performance.now() - startTime).toFixed(1)
      
      modelInstance = loadedModel
      trainedLabels = loadedModel.getClassLabels ? loadedModel.getClassLabels() : []
      
      console.info(`[EcoSort AI] Model loaded successfully in ${loadDuration}ms.`, {
        labels: trainedLabels,
        totalClasses: loadedModel.getTotalClasses ? loadedModel.getTotalClasses() : trainedLabels.length
      })

      return loadedModel
    } catch (error) {
      modelLoadingPromise = null
      console.error('[EcoSort AI] Critical error loading model files:', error)
      throw new Error(
        error instanceof Error
          ? `Failed to load model: ${error.message}`
          : 'Failed to load model files from /model/ path. Ensure model.json, metadata.json, and weights.bin are accessible.'
      )
    }
  })()

  return modelLoadingPromise
}

export function isModelLoaded(): boolean {
  return modelInstance !== null
}

export function getLoadedClassLabels(): string[] {
  return trainedLabels.length > 0 ? [...trainedLabels] : []
}

export async function predictWaste(
  input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
): Promise<Prediction[]> {
  const model = await loadWasteModel()
  
  try {
    const rawPredictions = await model.predict(input)
    
    if (!rawPredictions || !Array.isArray(rawPredictions) || rawPredictions.length === 0) {
      throw new Error('Inference engine returned an empty prediction array.')
    }

    const validated: Prediction[] = rawPredictions.map((pred) => {
      const prob = typeof pred.probability === 'number' && Number.isFinite(pred.probability)
        ? Math.max(0, Math.min(1, pred.probability))
        : 0
      return {
        className: pred.className,
        probability: prob
      }
    })

    // Sort descending by probability
    validated.sort((a, b) => b.probability - a.probability)
    return validated
  } catch (inferenceError) {
    console.error('[EcoSort AI] Frame inference failure:', inferenceError)
    throw inferenceError
  }
}
