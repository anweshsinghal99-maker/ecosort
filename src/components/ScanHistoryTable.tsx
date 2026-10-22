import React from 'react'
import type { ScanRecord } from '../types'

interface ScanHistoryTableProps {
  history: ScanRecord[]
  onViewAllHistory?: () => void
  onSelectScan?: (scan: ScanRecord) => void
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({
  history,
  onViewAllHistory,
  onSelectScan
}) => {
  const recentItems = history.slice(0, 5)

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Recent Scans
          </h3>
          <span className="px-2 py-0.5 rounded font-code-sm text-code-sm bg-surface-container text-on-surface-variant font-medium">
            Session Audit Stream
          </span>
        </div>

        {onViewAllHistory && history.length > 0 && (
          <button
            onClick={onViewAllHistory}
            type="button"
            className="inline-flex items-center gap-1 font-label-lg text-sm text-primary hover:text-primary-container font-semibold transition-colors cursor-pointer"
          >
            <span>View all history ({history.length})</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Table Content or Empty State */}
      {recentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low/40 rounded-xl border border-dashed border-outline-variant/40 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
          <h4 className="font-headline-sm text-base text-on-surface font-semibold">
            No Scans Recorded in this Session
          </h4>
          <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mt-1">
            Perform your first 5-second camera scan to start logging waste classifications.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg font-semibold">Detected Material</th>
                <th className="py-3 px-4 font-semibold">Classification Stream</th>
                <th className="py-3 px-4 font-semibold">Confidence Rating</th>
                <th className="py-3 px-4 font-semibold">Action Protocol</th>
                <th className="py-3 px-4 rounded-r-lg font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-on-surface font-body-md text-sm">
              {recentItems.map((scan) => {
                const confPercent = Math.round(scan.confidence * 100)
                const isHigh = scan.confidenceLevel === 'high'
                const isMed = scan.confidenceLevel === 'medium'
                const timeString = new Date(scan.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })

                return (
                  <tr
                    key={scan.id}
                    onClick={() => onSelectScan?.(scan)}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-b border-outline-variant/10 last:border-b-0"
                  >
                    {/* Material */}
                    <td className="py-3.5 px-4 font-medium text-on-surface flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 overflow-hidden border border-outline-variant/20">
                        {scan.image ? (
                          <img
                            src={scan.image}
                            alt={scan.category}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[20px]">
                            {scan.guidance.icon}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{scan.displayName}</span>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          {scan.category}
                        </span>
                      </div>
                    </td>

                    {/* Stream Pill */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-xs bg-surface-container-high text-on-surface font-semibold">
                        {scan.guidance.stream}
                      </span>
                    </td>

                    {/* Confidence Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-code-sm text-xs font-bold text-on-surface w-9">
                          {confPercent}%
                        </span>
                        <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isHigh
                                ? 'bg-primary'
                                : isMed
                                ? 'bg-amber-600'
                                : 'bg-error'
                            }`}
                            style={{ width: `${confPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-on-surface-variant font-body-sm text-xs max-w-xs truncate">
                      {scan.guidance.immediateAction}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-right font-code-sm text-xs text-outline whitespace-nowrap">
                      {timeString}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
