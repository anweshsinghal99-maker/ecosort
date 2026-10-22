import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { CameraScanner } from './components/CameraScanner'
import { WasteProfileCard } from './components/WasteProfileCard'
import { DashboardView } from './components/DashboardView'
import { TeachAiView } from './components/TeachAiView'
import { ScanHistoryView } from './components/ScanHistoryView'
import { WasteGuideView } from './components/WasteGuideView'
import { AboutProjectView } from './components/AboutProjectView'
import { HelpModal } from './components/HelpModal'

import { loadWasteModel, predictWaste } from './services/modelService'
import { computeSessionStats, getConfidenceLevel } from './services/predictionService'
import { getWasteGuidance } from './data/wasteGuidance'
import { useWasteScanner } from './hooks/useWasteScanner'
import type { PageRoute, Prediction, ScanRecord } from './types'

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('waste-scanner')
  const [modelState, setModelState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [latestScan, setLatestScan] = useState<ScanRecord | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false)

  // Initialize Teachable Machine model on load
  const initModel = useCallback(async () => {
    setModelState('loading')
    try {
      await loadWasteModel()
      setModelState('ready')
    } catch (err) {
      console.error('[EcoSort AI] Model initialization failed:', err)
      setModelState('error')
    }
  }, [])

  useEffect(() => {
    void initModel()
  }, [initModel])

  // Handle successful 5-second multi-frame scan completion
  const handleScanComplete = useCallback(
    (predictions: Prediction[], capturedImage: string, latencyMs: number) => {
      if (!predictions.length) return

      const topPrediction = predictions[0]
      const guidance = getWasteGuidance(topPrediction.className)
      const confidenceLevel = getConfidenceLevel(topPrediction.probability, topPrediction.className)

      const record: ScanRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: topPrediction.className,
        displayName: guidance.displayName,
        confidence: topPrediction.probability,
        confidenceLevel,
        predictions,
        guidance,
        image: capturedImage,
        latencyMs
      }

      setLatestScan(record)
      setHistory((prev) => [record, ...prev])
    },
    []
  )

  const scanner = useWasteScanner({
    videoRef,
    modelReady: modelState === 'ready',
    onScanComplete: handleScanComplete
  })

  // Handle route changes safely
  const handleNavigate = (route: PageRoute) => {
    if (route !== 'waste-scanner') {
      scanner.cancelScan()
    }
    setCurrentRoute(route)
  }

  // Fallback: Test with uploaded static photo through actual model
  const handleImageSelected = useCallback(
    async (file: File) => {
      if (modelState !== 'ready') return
      try {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.src = url
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true)
          img.onerror = reject
        })

        const startTime = performance.now()
        const preds = await predictWaste(img)
        const latency = Math.round(performance.now() - startTime)
        URL.revokeObjectURL(url)

        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = (e.target?.result as string) || ''
          handleScanComplete(preds, dataUrl, latency)
        }
        reader.readAsDataURL(file)
      } catch (err) {
        console.error('[EcoSort AI] Error predicting uploaded image:', err)
      }
    },
    [handleScanComplete, modelState]
  )

  const sessionStats = useMemo(() => computeSessionStats(history), [history])

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex">
      {/* 1. Persistent Left Navigation Rail (Width 240px) */}
      <Sidebar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* 2. Primary Workspace (Padded Left for Rail) */}
      <div className="pl-60 flex-1 flex flex-col min-h-screen w-full">
        {/* Fixed Header */}
        <Header
          currentRoute={currentRoute}
          cameraActive={scanner.cameraActive}
          activeCameraLabel={scanner.activeCameraLabel}
          modelState={modelState}
          onRetryModel={initModel}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Main Content Area */}
        <main className="w-full pt-20 px-gutter-desktop py-space-lg flex-1 flex flex-col">
          {/* VIEW: Clean, Uncluttered Waste Scanner */}
          {currentRoute === 'waste-scanner' && (
            <div className="flex flex-col gap-space-lg w-full max-w-7xl animate-fade-in">
              {/* 2-Column Balanced Scanner Workspace */}
              <section className="grid grid-cols-12 gap-gutter-desktop items-start">
                <CameraScanner
                  videoRef={videoRef}
                  phase={scanner.phase}
                  countdownSeconds={scanner.countdownSeconds}
                  progressPercent={scanner.progressPercent}
                  sampledFrameCount={scanner.sampledFrameCount}
                  cameraActive={scanner.cameraActive}
                  activeCameraLabel={scanner.activeCameraLabel}
                  inferenceLatencyMs={scanner.inferenceLatencyMs}
                  errorMessage={scanner.errorMessage}
                  modelReady={modelState === 'ready'}
                  onStartScan={scanner.startScan}
                  onCancelScan={scanner.cancelScan}
                  onReset={scanner.resetScanner}
                  onImageSelected={handleImageSelected}
                />

                <WasteProfileCard
                  latestScan={latestScan}
                  onScanAgain={scanner.startScan}
                  onLogItem={(scan) => {
                    alert(`Item "${scan.displayName}" bookmarked in session.`)
                  }}
                />
              </section>

              {/* Minimal Clean Recent Scans Ticker (Last 3 only, not cluttering the screen!) */}
              {history.length > 0 && (
                <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                      Recent Session Scans:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {history.slice(0, 3).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLatestScan(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span>{item.displayName}</span>
                          <span className="text-[10px] font-code-sm text-outline">
                            ({Math.round(item.confidence * 100)}%)
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentRoute('scan-history')}
                    type="button"
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>View All ({history.length})</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: Dedicated Dashboard */}
          {currentRoute === 'dashboard' && (
            <DashboardView
              stats={sessionStats}
              history={history}
              onViewAllHistory={() => setCurrentRoute('scan-history')}
              onSelectScan={(scan) => {
                setLatestScan(scan)
                setCurrentRoute('waste-scanner')
              }}
              onOpenScanner={() => setCurrentRoute('waste-scanner')}
            />
          )}

          {/* VIEW: Teach AI & Category Accuracy Studio */}
          {currentRoute === 'teach-ai' && (
            <TeachAiView onBackToScanner={() => setCurrentRoute('waste-scanner')} />
          )}

          {/* VIEW: Full Scan History */}
          {currentRoute === 'scan-history' && (
            <ScanHistoryView
              history={history}
              onClearHistory={() => setHistory([])}
              onSelectScan={(scan) => {
                setLatestScan(scan)
                setCurrentRoute('waste-scanner')
              }}
              onBackToScanner={() => setCurrentRoute('waste-scanner')}
            />
          )}

          {/* VIEW: Waste Guide with Category Accuracy */}
          {currentRoute === 'waste-guide' && (
            <WasteGuideView onStartScanForCategory={() => setCurrentRoute('waste-scanner')} />
          )}

          {/* VIEW: About Project */}
          {currentRoute === 'about-project' && <AboutProjectView />}
        </main>
      </div>

      {/* Help & System Documentation Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}
