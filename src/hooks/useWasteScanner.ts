import { useCallback, useEffect, useRef, useState } from 'react'
import { predictWaste } from '../services/modelService'
import { aggregateFramePredictions } from '../services/predictionService'
import { captureSnapshot, requestCameraStream, stopMediaStream } from '../services/cameraService'
import type { Prediction, ScanPhase } from '../types'

const SCAN_DURATION_MS = 5000
const SAMPLE_INTERVAL_MS = 250 // ~20 frames over 5 seconds

interface UseWasteScannerOptions {
  videoRef: React.RefObject<HTMLVideoElement>
  modelReady: boolean
  onScanComplete: (predictions: Prediction[], capturedImage: string, latencyMs: number) => void
}

export function useWasteScanner({
  videoRef,
  modelReady,
  onScanComplete
}: UseWasteScannerOptions) {
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5)
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const [sampledFrameCount, setSampledFrameCount] = useState<number>(0)
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>('Standard HD Camera')
  const [inferenceLatencyMs, setInferenceLatencyMs] = useState<number>(14)

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const sampleIntervalRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)
  const scanTimerRef = useRef<number | null>(null)
  const collectedFramesRef = useRef<Prediction[][]>([])
  const isSamplingRef = useRef<boolean>(false)
  const scanStartTimestampRef = useRef<number>(0)

  const clearAllTimers = useCallback(() => {
    if (sampleIntervalRef.current !== null) {
      window.clearInterval(sampleIntervalRef.current)
      sampleIntervalRef.current = null
    }
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    if (scanTimerRef.current !== null) {
      window.clearTimeout(scanTimerRef.current)
      scanTimerRef.current = null
    }
  }, [])

  const stopCamera = useCallback(() => {
    clearAllTimers()
    if (mediaStreamRef.current) {
      stopMediaStream(mediaStreamRef.current)
      mediaStreamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }, [clearAllTimers, videoRef])

  const initializeCamera = useCallback(async (): Promise<boolean> => {
    try {
      if (mediaStreamRef.current && mediaStreamRef.current.active) {
        return true
      }
      setErrorMessage(null)
      const stream = await requestCameraStream()
      mediaStreamRef.current = stream
      
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        setActiveCameraLabel(videoTrack.label || 'Webcam Stream')
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
      return true
    } catch (err: unknown) {
      const errObj = err as Error
      console.error('[EcoSort AI] Camera initialization error:', errObj)
      setErrorMessage(errObj.message || 'Unable to access video camera.')
      setPhase('error')
      stopCamera()
      return false
    }
  }, [stopCamera, videoRef])

  const startScan = useCallback(async () => {
    if (phase === 'scanning' || phase === 'analyzing') {
      return
    }

    if (!modelReady) {
      setErrorMessage('The waste classification model is still initializing. Please wait a moment.')
      setPhase('error')
      return
    }

    setErrorMessage(null)
    setPhase('countdown')
    setProgressPercent(0)
    setCountdownSeconds(5)
    setSampledFrameCount(0)
    collectedFramesRef.current = []

    const cameraOk = await initializeCamera()
    if (!cameraOk) {
      return
    }

    setPhase('scanning')
    scanStartTimestampRef.current = performance.now()
    const scanStartTime = performance.now()

    // 1. Frame sampling loop
    const sampleFrame = async () => {
      if (isSamplingRef.current) return
      const videoEl = videoRef.current
      if (!videoEl || videoEl.readyState < 2 || videoEl.paused || videoEl.ended) {
        return
      }

      isSamplingRef.current = true
      const frameStart = performance.now()
      try {
        const preds = await predictWaste(videoEl)
        const frameLatency = Math.round(performance.now() - frameStart)
        setInferenceLatencyMs(frameLatency)
        
        if (preds && preds.length > 0) {
          collectedFramesRef.current.push(preds)
          setSampledFrameCount(collectedFramesRef.current.length)
        }
      } catch (err) {
        console.warn('[EcoSort AI] Dropped frame during continuous sampling:', err)
      } finally {
        isSamplingRef.current = false
      }
    }

    // Initial immediate sample
    void sampleFrame()
    sampleIntervalRef.current = window.setInterval(() => {
      void sampleFrame()
    }, SAMPLE_INTERVAL_MS)

    // 2. Continuous progress and 5-second countdown ticker
    countdownIntervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - scanStartTime
      const remainingSeconds = Math.max(1, Math.ceil((SCAN_DURATION_MS - elapsed) / 1000))
      const percent = Math.min(100, Math.round((elapsed / SCAN_DURATION_MS) * 100))
      
      setCountdownSeconds(remainingSeconds)
      setProgressPercent(percent)
    }, 100)

    // 3. Scan completion after 5 seconds
    scanTimerRef.current = window.setTimeout(async () => {
      clearAllTimers()
      setProgressPercent(100)
      setCountdownSeconds(0)
      setPhase('analyzing')

      // Capture high-res snapshot
      let snapshot = ''
      if (videoRef.current) {
        snapshot = captureSnapshot(videoRef.current)
      }

      // Allow any in-flight inference to complete
      let waitBudget = 10
      while (isSamplingRef.current && waitBudget > 0) {
        await new Promise((res) => window.setTimeout(res, 30))
        waitBudget--
      }

      const totalScanLatency = Math.round(performance.now() - scanStartTimestampRef.current)
      const validFrames = collectedFramesRef.current

      console.info(`[EcoSort AI] 5-second capture finished. Sampled ${validFrames.length} frames. Aggregating probabilities...`)

      // Stop webcam tracks cleanly after scan completes
      stopCamera()

      const aggregatedResults = aggregateFramePredictions(validFrames)
      if (aggregatedResults.length === 0) {
        setErrorMessage('Could not obtain valid image frames from camera. Check lighting and reticle alignment.')
        setPhase('error')
        return
      }

      // Emit complete scan dossier
      onScanComplete(aggregatedResults, snapshot, totalScanLatency)
      setPhase('result')
    }, SCAN_DURATION_MS)
  }, [clearAllTimers, initializeCamera, modelReady, onScanComplete, phase, stopCamera, videoRef])

  const cancelScan = useCallback(() => {
    clearAllTimers()
    stopCamera()
    setProgressPercent(0)
    setCountdownSeconds(5)
    setSampledFrameCount(0)
    setPhase('idle')
  }, [clearAllTimers, stopCamera])

  const resetScanner = useCallback(() => {
    cancelScan()
    setErrorMessage(null)
    setPhase('idle')
  }, [cancelScan])

  // Cleanup on unmount or navigation
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    phase,
    countdownSeconds,
    progressPercent,
    sampledFrameCount,
    cameraActive,
    activeCameraLabel,
    inferenceLatencyMs,
    errorMessage,
    startScan,
    cancelScan,
    resetScanner,
    initializeCamera
  }
}
