import React from 'react'
import type { PageRoute } from '../types'

interface HeaderProps {
  currentRoute: PageRoute
  cameraActive: boolean
  activeCameraLabel: string
  modelState: 'loading' | 'ready' | 'error'
  onRetryModel: () => void
  onOpenHelp: () => void
}

const pageTitles: Record<PageRoute, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Sustainability Dashboard',
    subtitle: 'Real-time telemetry, aggregate facility sorting & municipal audit trends.'
  },
  'waste-scanner': {
    title: 'Waste Scanner',
    subtitle: 'Identify waste. Make the right disposal decision.'
  },
  'scan-history': {
    title: 'Scan Audit History',
    subtitle: 'Complete session verification log and compliance records.'
  },
  'waste-guide': {
    title: 'Waste Management Guide',
    subtitle: 'Material stream specifications, preparation rules & ecological tips.'
  },
  'teach-ai': {
    title: 'Model Engine Studio',
    subtitle: 'Dataset integration & benchmark calibration across 6 waste categories.'
  },
  'about-project': {
    title: 'About EcoSort',
    subtitle: 'Client-side edge computer vision for precise environmental stewardship.'
  }
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  cameraActive,
  activeCameraLabel,
  modelState,
  onRetryModel,
  onOpenHelp
}) => {
  const { title, subtitle } = pageTitles[currentRoute]

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-surface/80 backdrop-blur-xl z-30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      <div className="w-full h-16 px-gutter-desktop flex items-center justify-between">
        {/* Left: View Titles */}
        <div className="flex items-center gap-space-md">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              {title}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Indicators */}
        <div className="flex items-center gap-space-sm">
          {/* Camera Readiness Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-[0_1px_3px_rgba(32,40,32,0.04)] border border-outline-variant/30">
            <span
              className={`w-2 h-2 rounded-full ${
                cameraActive ? 'bg-primary animate-pulse' : 'bg-outline-variant'
              }`}
            />
            <span className="font-code-sm text-code-sm text-on-surface font-medium truncate max-w-[180px]">
              {cameraActive ? `Camera Connected (${activeCameraLabel})` : 'Camera Standby'}
            </span>
          </div>

          {/* Model Status Badge */}
          {modelState === 'ready' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="font-code-sm text-code-sm font-semibold">
                Classifier Ready
              </span>
            </div>
          )}

          {modelState === 'loading' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant animate-pulse">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span className="font-code-sm text-code-sm">Initializing Classifier...</span>
            </div>
          )}

          {modelState === 'error' && (
            <button
              onClick={onRetryModel}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container hover:bg-error/20 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span className="font-code-sm text-code-sm font-semibold">Model Error (Retry)</span>
            </button>
          )}

          {/* Help & Documentation Button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center ml-1"
            title="Help & System Guide"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  )
}
