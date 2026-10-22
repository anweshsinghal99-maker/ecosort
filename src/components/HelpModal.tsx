import React from 'react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202820]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">help_center</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              EcoSort User Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 text-sm text-on-surface-variant leading-relaxed">
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
            <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">timelapse</span>
              Continuous 5-Second Scan Cycle
            </span>
            <p className="text-xs">
              When you click <strong>Start Scan</strong>, the application activates your webcam for 5 continuous seconds, sampling multiple frames (~20 frames). The final classification is calculated as the arithmetic mean probability of each class across all valid frames.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
            <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              Confidence Thresholds
            </span>
            <p className="text-xs">
              <strong>High Confidence (&ge;80%):</strong> Reliable material match with full circular economy directives.
              <br />
              <strong>Medium Confidence (60%&ndash;79%):</strong> Likely match, verify resin code stamp.
              <br />
              <strong>Low Confidence (&lt;60% or Mixed):</strong> Triggers Guided Rescan Protocol to avoid wishcycling.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
            <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">privacy_tip</span>
              Hardware &amp; Privacy
            </span>
            <p className="text-xs">
              Camera frames are processed in-memory directly in your browser tab via TensorFlow.js. Web camera tracks are safely turned off immediately after the 5-second sampling phase concludes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
