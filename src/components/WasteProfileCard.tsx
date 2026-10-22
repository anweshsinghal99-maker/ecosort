import React, { useState } from 'react'
import type { ScanRecord } from '../types'
import { buildClassBreakdown } from '../services/predictionService'

interface WasteProfileCardProps {
  latestScan: ScanRecord | null
  onScanAgain: () => void
  onLogItem?: (scan: ScanRecord) => void
}

export const WasteProfileCard: React.FC<WasteProfileCardProps> = ({
  latestScan,
  onScanAgain,
  onLogItem
}) => {
  const [showFullBreakdown, setShowFullBreakdown] = useState(false)

  // 1. ZEN IDLE STATE (Uncluttered, Calm, Spacious)
  if (!latestScan) {
    return (
      <div className="col-span-12 xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 min-h-[460px] justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            <span className="font-headline-sm text-sm font-semibold text-on-surface">
              Identification Dossier
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full font-label-sm text-xs bg-surface-container text-on-surface-variant">
            Awaiting Input
          </span>
        </div>

        {/* Calm Zen Placeholder */}
        <div className="flex flex-col items-center justify-center text-center p-6 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[32px]">eco</span>
          </div>
          <h3 className="font-headline-sm text-base font-semibold text-on-surface">
            Ready to Analyze Waste
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mt-1 leading-relaxed">
            Align item in the camera view and click <strong>Start 5s Scan</strong>. Real-time predictions will appear here with disposal directives.
          </p>
        </div>

        {/* Minimal Baseline Indicator */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 flex items-center justify-between text-xs text-on-surface-variant border border-outline-variant/20">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            6 waste categories calibrated
          </span>
          <span className="font-code-sm font-semibold">95.1% Avg Accuracy</span>
        </div>
      </div>
    )
  }

  const { guidance, confidence, confidenceLevel, predictions, image } = latestScan
  const breakdown = buildClassBreakdown(predictions)
  const confidencePercent = (confidence * 100).toFixed(1)
  const isLowConfidence = confidenceLevel === 'low' || latestScan.category === 'Mixed/Uncertain Waste'

  // 2. LOW CONFIDENCE / UNCERTAIN RESULT
  if (isLowConfidence) {
    return (
      <div className="col-span-12 xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md animate-fade-in">
        {/* Warning Banner */}
        <div className="p-3 rounded-xl bg-error-container text-on-error-container flex items-center gap-2.5">
          <span className="material-symbols-outlined text-error text-[22px]">warning</span>
          <div className="flex flex-col">
            <span className="font-label-lg text-xs font-bold">Uncertain result &mdash; rescan recommended</span>
            <span className="font-body-sm text-[11px] opacity-90">
              Confidence ({confidencePercent}%) is below optimal operational threshold.
            </span>
          </div>
        </div>

        {/* Header & Category */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase tracking-wider">
              Top Likely Match
            </span>
            <h2 className="font-display-md text-xl font-bold text-on-surface">
              {guidance.displayName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-code-sm bg-surface-container text-on-surface font-semibold">
                Accuracy Benchmark: {guidance.categoryAccuracy}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-display-lg text-2xl font-bold text-error leading-none block">
              {confidencePercent}%
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Model Confidence</span>
          </div>
        </div>

        {/* Guided Rescan Checklist */}
        <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
          <span className="font-label-sm text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[16px]">checklist</span>
            Quick Alignment Protocol
          </span>
          <ul className="space-y-1.5 text-xs text-on-surface-variant">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span><strong>Lighting:</strong> Avoid direct overhead glare or dark shadows.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span><strong>Single item:</strong> Clear extraneous background clutter.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span><strong>Rotate:</strong> Expose the recycling symbol or material seams.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onScanAgain}
          type="button"
          className="w-full h-11 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Initiate Rescan (5s)</span>
        </button>
      </div>
    )
  }

  // 3. UNCLUTTERED ELEGANT CLASSIFICATION DOSSIER (High/Medium Confidence)
  return (
    <div className="col-span-12 xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md animate-fade-in">
      {/* Category Accuracy Benchmark Ribbon */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 text-xs">
        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>{guidance.categoryAccuracy}% Model Accuracy Benchmark</span>
        </span>
        <span className="font-code-sm text-[11px] text-on-surface-variant">
          {guidance.precisionRating.split('•')[0]}
        </span>
      </div>

      {/* Main Category Header with Image Thumbnail */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold bg-secondary-container text-on-secondary-container">
              {guidance.binBadge}
            </span>
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              {guidance.materialCode}
            </span>
          </div>

          <h2 className="font-display-md text-2xl font-bold text-on-surface mt-1 leading-tight">
            {guidance.displayName}
          </h2>
          <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            {guidance.subHeading}
          </span>
        </div>

        {/* Snapshot or Category Icon */}
        <div className="w-16 h-16 rounded-xl bg-surface-container p-1 shadow-sm shrink-0 border border-outline-variant/30 overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt="Scanned item" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="material-symbols-outlined text-primary text-[28px]">
              {guidance.icon}
            </span>
          )}
        </div>
      </div>

      {/* Confidence Score Bar (Clean, Minimalist) */}
      <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
        <div>
          <span className="font-display-lg text-2xl font-bold text-primary leading-none">
            {confidencePercent}%
          </span>
          <span className="font-label-sm text-[10px] text-on-surface-variant block mt-0.5">
            Confidence across 5s frame stream
          </span>
        </div>
        <div className="text-right">
          <span className="px-2.5 py-1 rounded-full font-label-sm text-xs font-semibold bg-secondary-fixed text-on-secondary-fixed inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Verified Match
          </span>
        </div>
      </div>

      {/* Clean 4-Step Disposal SOP (No bulky nested paragraphs) */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-sm text-xs font-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[16px]">task_alt</span>
          Disposal Action Steps
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {guidance.steps.map((s) => (
            <div
              key={s.step}
              className="p-2.5 rounded-lg bg-surface-container-low/70 flex items-start gap-2 border border-outline-variant/15"
            >
              <div className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface">{s.title}</span>
                <span className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                  {s.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible 6-Class Probability Breakdown (De-clutter toggle) */}
      <div className="pt-1 border-t border-outline-variant/15">
        <button
          type="button"
          onClick={() => setShowFullBreakdown(!showFullBreakdown)}
          className="text-xs text-on-surface-variant hover:text-primary flex items-center justify-between w-full cursor-pointer py-1"
        >
          <span className="font-medium">
            {showFullBreakdown ? 'Hide Full Breakdown' : 'View All 6 Class Probabilities'}
          </span>
          <span className="material-symbols-outlined text-[16px]">
            {showFullBreakdown ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showFullBreakdown && (
          <div className="space-y-1.5 pt-2 animate-fade-in">
            {breakdown.map((item) => (
              <div key={item.className} className="flex items-center gap-2 text-xs">
                <span className="w-36 text-on-surface truncate font-medium">
                  {item.className}
                </span>
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.isPrimary ? 'bg-primary' : 'bg-outline-variant'}`}
                    style={{ width: `${Math.max(2, item.percentage)}%` }}
                  />
                </div>
                <span className="w-10 text-right font-code-sm font-semibold text-on-surface">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onScanAgain}
          type="button"
          className="flex-1 h-11 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Scan Next Item</span>
        </button>

        {onLogItem && (
          <button
            onClick={() => onLogItem(latestScan)}
            type="button"
            className="h-11 px-4 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Bookmark this scan"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
          </button>
        )}
      </div>
    </div>
  )
}
