import type { ClassBreakdown, ConfidenceLevel, Prediction, ScanRecord, SessionStats } from '../types'
import { wasteGuidanceRegistry } from '../data/wasteGuidance'

/**
 * Aggregates prediction arrays across multiple video frames over the 5-second interval.
 * Uses arithmetic mean probability for each unique class across all valid captured frames:
 *   aggregated_p(class_i) = (1 / N) * sum_{f=1}^N p_f(class_i)
 */
export function aggregateFramePredictions(frames: Prediction[][]): Prediction[] {
  if (!frames || frames.length === 0) {
    return []
  }

  const validFrames = frames.filter((f) => Array.isArray(f) && f.length > 0)
  if (validFrames.length === 0) {
    return []
  }

  const totalProbabilities = new Map<string, number>()
  const frameCounts = new Map<string, number>()

  for (const frame of validFrames) {
    for (const { className, probability } of frame) {
      const currentSum = totalProbabilities.get(className) ?? 0
      const currentCount = frameCounts.get(className) ?? 0
      totalProbabilities.set(className, currentSum + probability)
      frameCounts.set(className, currentCount + 1)
    }
  }

  const aggregated: Prediction[] = []
  for (const [className, sum] of totalProbabilities.entries()) {
    const count = frameCounts.get(className) || validFrames.length
    aggregated.push({
      className,
      probability: sum / count
    })
  }

  // Sort descending by mean probability
  aggregated.sort((a, b) => b.probability - a.probability)
  return aggregated
}

/**
 * Categorizes confidence into High, Medium, or Low according to prompt thresholds:
 * - High: 80% or higher
 * - Medium: 60% to below 80%
 * - Low: below 60%
 * (Or if Mixed/Uncertain Waste is the top class, flags as low/uncertain)
 */
export function getConfidenceLevel(probability: number, className?: string): ConfidenceLevel {
  if (className === 'Mixed/Uncertain Waste') {
    return 'low'
  }
  if (probability >= 0.80) {
    return 'high'
  }
  if (probability >= 0.60) {
    return 'medium'
  }
  return 'low'
}

/**
 * Builds the complete breakdown list with display formatting and stream color tokens.
 */
export function buildClassBreakdown(predictions: Prediction[]): ClassBreakdown[] {
  return predictions.map((pred, index) => {
    const guidance = wasteGuidanceRegistry[pred.className]
    return {
      className: pred.className,
      displayName: guidance ? guidance.displayName : pred.className,
      probability: pred.probability,
      percentage: Number((pred.probability * 100).toFixed(1)),
      isPrimary: index === 0,
      streamColor: guidance ? guidance.colorToken : 'uncertain'
    }
  })
}

/**
 * Computes live session statistics from the client history array.
 */
export function computeSessionStats(history: ScanRecord[]): SessionStats {
  if (history.length === 0) {
    return {
      totalScans: 0,
      topCategory: 'No Data Yet',
      topCategoryCount: 0,
      topCategoryPercentage: 0,
      itemsIdentified: 0,
      highConfidenceRate: 0,
      avgConfidence: 0
    }
  }

  const counts = new Map<string, number>()
  let totalConfidence = 0
  let highConfidenceCount = 0

  for (const scan of history) {
    counts.set(scan.category, (counts.get(scan.category) ?? 0) + 1)
    totalConfidence += scan.confidence
    if (scan.confidenceLevel === 'high') {
      highConfidenceCount++
    }
  }

  let topCategory = ''
  let maxCount = 0
  for (const [cat, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count
      topCategory = cat
    }
  }

  const totalScans = history.length
  const topGuidance = wasteGuidanceRegistry[topCategory]
  const topDisplayName = topGuidance ? topGuidance.displayName : topCategory

  return {
    totalScans,
    topCategory: topDisplayName || 'N/A',
    topCategoryCount: maxCount,
    topCategoryPercentage: Math.round((maxCount / totalScans) * 100),
    itemsIdentified: totalScans,
    highConfidenceRate: Math.round((highConfidenceCount / totalScans) * 100),
    avgConfidence: Number(((totalConfidence / totalScans) * 100).toFixed(1))
  }
}
