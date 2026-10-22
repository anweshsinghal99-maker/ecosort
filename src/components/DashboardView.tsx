import React from 'react'
import type { ScanRecord, SessionStats } from '../types'
import { ScanMetrics } from './ScanMetrics'
import { ScanHistoryTable } from './ScanHistoryTable'
import { MODEL_CLASSES, wasteGuidanceRegistry } from '../data/wasteGuidance'

interface DashboardViewProps {
  stats: SessionStats
  history: ScanRecord[]
  onViewAllHistory: () => void
  onSelectScan: (scan: ScanRecord) => void
  onOpenScanner: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  history,
  onViewAllHistory,
  onSelectScan,
  onOpenScanner
}) => {
  return (
    <div className="flex flex-col gap-space-lg w-full max-w-7xl animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
            TELEMETRY &bull; RECYCLING FACILITY AUDIT
          </span>
          <h2 className="font-display-md text-2xl lg:text-3xl font-bold text-on-surface">
            Sustainability &amp; Metrics Dashboard
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Aggregated stream volume, sorting precision, and category accuracy metrics for the active session.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          type="button"
          className="h-10 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          <span>Launch Scanner</span>
        </button>
      </div>

      {/* 3 Summary Metrics */}
      <ScanMetrics stats={stats} />

      {/* Category Accuracy Benchmarks Overview Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Category Accuracy Benchmarks
            </h3>
          </div>
          <span className="font-code-sm text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-semibold">
            TACO (CC BY 4.0) &amp; TrashNet Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {MODEL_CLASSES.map((cls) => {
            const guidance = wasteGuidanceRegistry[cls]
            return (
              <div
                key={cls}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-center items-center"
              >
                <span className="font-label-sm text-xs text-on-surface truncate w-full font-medium">
                  {cls}
                </span>
                <span className="font-display-lg text-lg font-bold text-primary leading-none">
                  {guidance.categoryAccuracy}%
                </span>
                <span className="font-code-sm text-[10px] text-outline">
                  {guidance.datasetSamplesCount.toLocaleString()} samples
                </span>
              </div>
            )
          })}
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-on-surface-variant gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">dataset</span>
            <span><strong>Training Corpus:</strong> 9,569 labelled instances from TACO (CC BY 4.0) &amp; TrashNet (2,527 images).</span>
          </div>
          <span className="font-code-sm text-primary font-bold">95.1% Average Accuracy</span>
        </div>
      </div>

      {/* Recent Scans Table */}
      <ScanHistoryTable
        history={history}
        onViewAllHistory={onViewAllHistory}
        onSelectScan={onSelectScan}
      />
    </div>
  )
}
