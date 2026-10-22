import React from 'react'
import type { SessionStats } from '../types'

interface ScanMetricsProps {
  stats: SessionStats
}

export const ScanMetrics: React.FC<ScanMetricsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
      {/* Metric 1: Total Scans */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Cumulative Throughput
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-space-md">
          <span className="font-display-lg text-3xl font-bold text-on-surface tracking-tight">
            {stats.totalScans}
          </span>
          <span className="font-headline-sm text-sm text-on-surface-variant font-medium">
            scans in session
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-primary font-label-sm text-xs">
          <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
          <span className="font-semibold">
            {stats.totalScans > 0 ? `+${stats.totalScans} items audited` : 'Ready for first scan'}
          </span>
        </div>
      </div>

      {/* Metric 2: Top Detected Category */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Primary Stream Dominance
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-space-md">
          <span className="font-headline-lg text-xl font-bold text-on-surface truncate">
            {stats.topCategory}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-code-sm text-xs text-on-surface-variant">
            {stats.totalScans > 0 ? `${stats.topCategoryPercentage}% of volume` : 'Awaiting data'}
          </span>
          <span className="px-2 py-0.5 rounded-full font-code-sm text-xs bg-secondary-container text-on-secondary-container font-semibold">
            {stats.topCategoryCount} units
          </span>
        </div>
      </div>

      {/* Metric 3: Session Identified */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Active Batch Precision
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-space-md">
          <span className="font-display-lg text-3xl font-bold text-on-surface tracking-tight">
            {stats.itemsIdentified}
          </span>
          <span className="font-headline-sm text-sm text-on-surface-variant font-medium">
            items sorted
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-primary font-label-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="font-semibold">
            {stats.totalScans > 0
              ? `${stats.highConfidenceRate}% high-confidence rate (avg ${stats.avgConfidence}%)`
              : 'Standby for continuous capture'}
          </span>
        </div>
      </div>
    </div>
  )
}
