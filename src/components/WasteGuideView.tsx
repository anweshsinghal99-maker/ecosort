import React, { useState } from 'react'
import { wasteGuidanceRegistry } from '../data/wasteGuidance'
import { TACO_TRASHNET_MAPPING } from '../data/tacoTrashnetDataset'
import type { WasteCategoryGuidance } from '../types'

interface WasteGuideViewProps {
  onStartScanForCategory?: () => void
}

export const WasteGuideView: React.FC<WasteGuideViewProps> = ({ onStartScanForCategory }) => {
  const categories = Object.values(wasteGuidanceRegistry)
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].className)
  const currentGuidance: WasteCategoryGuidance =
    wasteGuidanceRegistry[selectedCategory] || categories[0]
  const currentDatasetMapping = TACO_TRASHNET_MAPPING[selectedCategory]

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-6xl animate-fade-in">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
            MATERIAL DIRECTORY &bull; CATEGORY ACCURACY
          </span>
          <h2 className="font-display-md text-2xl lg:text-3xl font-bold text-on-surface">
            Waste Management &amp; Accuracy Guide
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Verified disposal directives and benchmark accuracy scores calibrated across all 6 model streams.
          </p>
        </div>

        {onStartScanForCategory && (
          <button
            onClick={onStartScanForCategory}
            type="button"
            className="h-10 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            <span>Test with Camera</span>
          </button>
        )}
      </div>

      {/* Category Accuracy Cards Overview (Clickable tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.className
          return (
            <button
              key={cat.className}
              type="button"
              onClick={() => setSelectedCategory(cat.className)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-outline-variant/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="font-label-sm text-xs truncate w-full">{cat.className}</span>
                <span className="font-code-sm text-[11px] font-bold text-primary mt-0.5">
                  {cat.categoryAccuracy}% Acc
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Category Dossier Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        {/* Top Header with Accuracy Pill */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full font-label-sm text-xs bg-secondary-container text-on-secondary-container font-bold">
                {currentGuidance.binBadge}
              </span>
              <span className="font-code-sm text-xs bg-surface-container text-on-surface px-2 py-0.5 rounded font-semibold">
                {currentGuidance.materialCode}
              </span>
            </div>
            <h3 className="font-display-md text-2xl font-bold text-on-surface mt-1.5">
              {currentGuidance.displayName}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              {currentGuidance.subHeading}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 rounded-full font-code-sm text-xs font-bold bg-primary text-on-primary shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              {currentGuidance.categoryAccuracy}% Model Accuracy
            </span>
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              {currentGuidance.precisionRating}
            </span>
            <span className="font-body-sm text-[10px] text-outline">
              Calibrated with {currentGuidance.datasetSamplesCount.toLocaleString()} TACO (CC BY 4.0) &amp; TrashNet samples
            </span>
          </div>
        </div>

        {/* Dataset Provenance & Mapping Banner */}
        {currentDatasetMapping && (
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-label-sm font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">dataset</span>
                Categorized Dataset Sources (TACO &amp; TrashNet)
              </span>
              <span className="font-code-sm text-[11px] text-secondary font-semibold">
                {currentDatasetMapping.totalSampleCount.toLocaleString()} Labelled Instances
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-surface-container-lowest/80 border border-outline-variant/15 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">TACO (CC BY 4.0)</span>
                  <span className="font-code-sm text-[11px] text-primary font-bold">
                    {currentDatasetMapping.tacoAnnotationCount.toLocaleString()} annotations
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  {currentDatasetMapping.tacoSubCategories.slice(0, 4).join(', ')}
                  {currentDatasetMapping.tacoSubCategories.length > 4 ? ', ...' : ''}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-surface-container-lowest/80 border border-outline-variant/15 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">TrashNet (Gary Thung)</span>
                  <span className="font-code-sm text-[11px] text-secondary font-bold">
                    {currentDatasetMapping.trashnetSampleCount.toLocaleString()} images
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  {currentDatasetMapping.trashnetClasses.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Clean Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Left Column: Directives */}
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span className="font-label-sm text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Material Identification
              </span>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {currentGuidance.identification}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span className="font-label-sm text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">pan_tool</span>
                Immediate Disposal Directive
              </span>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {currentGuidance.immediateAction}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span className="font-label-sm text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Preparation &amp; Pre-Treatment
              </span>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {currentGuidance.preparation}
              </p>
            </div>
          </div>

          {/* Right Column: Circular Route & Key Optical Features */}
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-secondary-container/50 border border-secondary-container flex flex-col gap-1">
              <span className="font-label-sm text-xs font-bold text-on-secondary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">move_to_inbox</span>
                Next-Stage Recycling Route
              </span>
              <p className="font-body-sm text-xs text-on-secondary-container leading-relaxed">
                {currentGuidance.nextStage}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
              <span className="font-label-sm text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">camera</span>
                What the Classifier Looks For (Optical Signatures)
              </span>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                {currentGuidance.keyOpticalFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs text-primary font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                {currentGuidance.impactFact}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Standard Operating Procedure */}
        <div className="pt-2 border-t border-outline-variant/15 flex flex-col gap-2">
          <span className="font-headline-sm text-xs font-bold text-on-surface">
            Standard Operating Procedure (SOP)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {currentGuidance.steps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/15 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    {s.icon}
                  </span>
                </div>
                <span className="font-semibold text-on-surface">{s.title}</span>
                <span className="text-[11px] text-on-surface-variant leading-tight">
                  {s.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
