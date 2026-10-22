import React from 'react'
import { wasteGuidanceRegistry } from '../data/wasteGuidance'
import { TACO_TRASHNET_MAPPING, getDatasetTotals } from '../data/tacoTrashnetDataset'

export const AboutProjectView: React.FC = () => {
  const totals = getDatasetTotals()

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-5xl animate-fade-in">
      {/* Intro Hero */}
      <div className="flex flex-col gap-2">
        <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
          ECOLOGICAL INTELLIGENCE PLATFORM
        </span>
        <h2 className="font-display-md text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
          Better sorting starts at the moment of disposal.
        </h2>
        <p className="font-body-lg text-base text-on-surface-variant max-w-3xl leading-relaxed mt-1">
          EcoSort fuses lightweight browser-based computer vision with responsible environmental directives. By deploying custom-trained deep learning directly in the web browser, users receive instant material classification without transferring sensitive video feeds across the internet.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">visibility</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
            Continuous 5-Second Frame Sampling
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Single-frame optical snapshots frequently suffer from specular glare, motion blur, and partial occlusions. EcoSort samples webcam frames continuously for 5 seconds (~20 sampled frames) and calculates the arithmetic mean probability distribution across the entire temporal window for resilient classifications.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
            100% Local Browser Inference
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            All weights and layer graphs execute strictly inside your local browser tab via WebGL and TensorFlow.js. No webcam frames, video buffers, or private indoor imagery ever depart your device or stream to third-party cloud analytics.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
            Responsible Ecological Calibration
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Material classification is not a guarantee of recyclability. EcoSort distinguishes between polymer identification and local municipal processing capabilities. When classifications drop below operational thresholds (80%), guided rescan protocols prevent the disastrous practice of &ldquo;wishcycling.&rdquo;
          </p>
        </div>

        {/* Card 4: Dataset Ingestion & Ground Truth */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">dataset</span>
          </div>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">
            Ground Truth: TACO (CC BY 4.0) &amp; TrashNet
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            Trained and calibrated using the <strong>TACO dataset</strong> (Trash Annotations in Context under CC BY 4.0 license, 7,042 annotations) and <strong>TrashNet</strong> (2,527 labelled images across broad material classes). All data is harmonized into 6 operational categories totaling {totals.grandTotalSamples.toLocaleString()} validated instances.
          </p>
        </div>
      </div>

      {/* Model Class Taxonomy & Accuracy Table */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Calibrated Categories &amp; Accuracy Benchmarks
            </h3>
            <span className="font-body-sm text-xs text-on-surface-variant">
              Trained on {totals.grandTotalSamples.toLocaleString()} instances ({totals.tacoAnnotationCount.toLocaleString()} TACO annotations + {totals.trashnetSampleCount.toLocaleString()} TrashNet images)
            </span>
          </div>
          <span className="font-code-sm text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-semibold self-start sm:self-auto">
            Edge Classifier Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(TACO_TRASHNET_MAPPING).map(([className, mapping], idx) => {
            const guidance = wasteGuidanceRegistry[className]
            return (
              <div
                key={className}
                className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-code-sm text-xs font-bold text-primary shrink-0">
                      {idx}
                    </span>
                    <span className="font-label-md text-xs font-bold text-on-surface leading-tight">
                      {className}
                    </span>
                  </div>
                  <span className="font-code-sm text-xs font-bold text-primary shrink-0">
                    {mapping.benchmarkAccuracy}% Acc
                  </span>
                </div>

                <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                  {guidance?.subHeading || guidance?.identification}
                </p>

                <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[10px] font-code-sm text-outline">
                  <span>TACO: {mapping.tacoAnnotationCount}</span>
                  <span>TrashNet: {mapping.trashnetSampleCount}</span>
                  <span className="font-semibold text-primary">Total: {mapping.totalSampleCount}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
