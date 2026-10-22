import React, { useRef, useState } from 'react'
import type { ScanPhase } from '../types'

interface CameraScannerProps {
  videoRef: React.RefObject<HTMLVideoElement>
  phase: ScanPhase
  countdownSeconds: number
  progressPercent: number
  sampledFrameCount: number
  cameraActive: boolean
  activeCameraLabel: string
  inferenceLatencyMs: number
  errorMessage: string | null
  modelReady: boolean
  onStartScan: () => void
  onCancelScan: () => void
  onReset: () => void
  onImageSelected?: (file: File) => void
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  videoRef,
  phase,
  countdownSeconds,
  progressPercent,
  sampledFrameCount,
  cameraActive,
  activeCameraLabel,
  inferenceLatencyMs,
  errorMessage,
  modelReady,
  onStartScan,
  onCancelScan,
  onReset,
  onImageSelected
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showTips, setShowTips] = useState(false)
  const isScanning = phase === 'scanning' || phase === 'countdown'
  const isAnalyzing = phase === 'analyzing'

  // Circumference for r=50 circle is 2 * PI * 50 = ~314.16
  const circumference = 314.16
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImageSelected) {
      onImageSelected(file)
    }
  }

  return (
    <div className="col-span-12 xl:col-span-7 flex flex-col bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Clean Uncluttered Header */}
      <div className="flex items-center justify-between pb-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">videocam</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-base text-on-surface font-semibold">
              Live Waste Scanner
            </h2>
            <span className="font-body-sm text-xs text-on-surface-variant">
              5-second continuous multi-frame classification
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isScanning ? (
            <span className="px-3 py-1 rounded-full font-label-sm text-xs bg-error-container text-on-error-container flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              Capturing ({sampledFrameCount} frames)
            </span>
          ) : isAnalyzing ? (
            <span className="px-3 py-1 rounded-full font-label-sm text-xs bg-secondary-container text-on-secondary-container flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
              Analyzing...
            </span>
          ) : errorMessage ? (
            <span className="px-3 py-1 rounded-full font-label-sm text-xs bg-error-container text-on-error-container font-medium">
              Sensor Attention
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full font-label-sm text-xs bg-surface-container text-on-surface flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Cinematic Viewfinder Viewport */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1c241d] text-white flex flex-col justify-between p-space-md shadow-inner select-none">
        {/* Real Live HTML5 Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Minimal Corner Brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary-fixed/80 pointer-events-none z-10 rounded-tl-sm"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary-fixed/80 pointer-events-none z-10 rounded-tr-sm"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary-fixed/80 pointer-events-none z-10 rounded-bl-sm"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary-fixed/80 pointer-events-none z-10 rounded-br-sm"></div>

        {/* Minimal Central Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`w-44 h-44 rounded-2xl border transition-all duration-300 flex items-center justify-center ${
              isScanning
                ? 'border-primary-fixed shadow-[0_0_20px_rgba(164,244,195,0.4)] scale-105'
                : 'border-dashed border-white/30'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isScanning ? 'bg-primary-fixed animate-ping' : 'bg-white/40'
              }`}
            ></div>
          </div>
        </div>

        {/* Laser Scan Sweep Line */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent shadow-[0_0_15px_#a4f4c3] pointer-events-none animate-scanline z-10" />
        )}

        {/* Top Minimal Pill Overlay */}
        <div className="relative z-20 flex items-center justify-between text-xs font-code-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
            <span>{cameraActive ? activeCameraLabel : 'Camera Standby'}</span>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-white/80">
            {inferenceLatencyMs}ms
          </div>
        </div>

        {/* Center Prompt / Countdown */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto text-center px-4">
          {phase === 'idle' && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-fixed mb-2">
                <span className="material-symbols-outlined text-[24px]">center_focus_strong</span>
              </div>
              <p className="font-headline-sm text-sm text-white font-semibold">
                Ready to identify item
              </p>
              <p className="font-body-sm text-xs text-white/70 max-w-xs mt-0.5">
                Center waste item in frame and click Start Scan
              </p>
            </div>
          )}

          {isScanning && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative flex items-center justify-center mb-2">
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    className="text-white/20"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <circle
                    className="text-primary-fixed transition-all duration-150"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-lg text-3xl text-primary-fixed font-bold leading-none">
                    {countdownSeconds}
                  </span>
                  <span className="font-code-sm text-[9px] text-primary-fixed-dim uppercase">
                    SEC
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-xs text-primary-fixed font-code-sm font-semibold">
                Sampling frame {sampledFrameCount}
              </span>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary-fixed mb-2">
                <span className="material-symbols-outlined text-[28px] animate-spin">hourglass_top</span>
              </div>
              <p className="font-headline-sm text-sm text-white font-semibold">
                Aggregating frames...
              </p>
              <p className="font-body-sm text-xs text-white/70">
                Calculating mean class probabilities
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-black/80 border border-error/50 p-3 rounded-xl max-w-sm backdrop-blur-md text-center">
              <span className="material-symbols-outlined text-error text-[24px]">videocam_off</span>
              <p className="text-xs text-white/90 mt-1">{errorMessage}</p>
              <button
                type="button"
                onClick={onStartScan}
                className="mt-2 px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-container"
              >
                Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* Viewport Bottom */}
        <div className="relative z-20 flex items-center justify-between font-code-sm text-[11px] text-white/60">
          <span>Edge Vision Classifier</span>
          <span className="text-primary-fixed font-medium">
            {isScanning ? `${progressPercent}%` : 'Standby'}
          </span>
        </div>
      </div>

      {/* Clean Uncluttered Action Bar */}
      <div className="flex flex-col gap-space-sm pt-space-md">
        <div className="flex items-center gap-2">
          {isScanning ? (
            <button
              onClick={onCancelScan}
              type="button"
              className="flex-1 h-11 px-5 rounded-xl bg-error-container text-on-error-container hover:bg-error/20 font-label-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">stop_circle</span>
              <span>Cancel Scan</span>
            </button>
          ) : (
            <button
              onClick={onStartScan}
              disabled={!modelReady || isAnalyzing}
              type="button"
              className="flex-1 h-11 px-6 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>{phase === 'result' ? 'Scan Next Item (5s)' : 'Start 5s Scan'}</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="h-11 px-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Upload photo to classify"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span className="hidden sm:inline">Upload</span>
          </button>

          <button
            onClick={onReset}
            className="h-11 w-11 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            title="Reset scanner"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>

        {/* Collapsible Clean Tips Bar (Does not crowd the view!) */}
        <div className="flex flex-col pt-1">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer self-start"
          >
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>{showTips ? 'Hide Tips' : 'Show Camera Alignment Tips'}</span>
            <span className="material-symbols-outlined text-[14px]">
              {showTips ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showTips && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant animate-fade-in border border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">wb_sunny</span>
                <span>Uniform lighting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">filter_1</span>
                <span>Single item only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">pan_tool</span>
                <span>Hold still 5s</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
