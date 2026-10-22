import React, { useState } from 'react'
import type { ScanRecord } from '../types'

interface ScanHistoryViewProps {
  history: ScanRecord[]
  onClearHistory: () => void
  onSelectScan: (scan: ScanRecord) => void
  onBackToScanner: () => void
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onClearHistory,
  onSelectScan,
  onBackToScanner
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [streamFilter, setStreamFilter] = useState<string>('all')

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.guidance.stream.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      streamFilter === 'all' || item.guidance.colorToken === streamFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
            AUDIT TRAIL &bull; SESSION REPOSITORY
          </span>
          <h2 className="font-display-md text-2xl lg:text-3xl font-bold text-on-surface">
            Client-Side Scan History
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Logs of all 5-second multi-frame camera inferences performed during this active browser session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToScanner}
            type="button"
            className="h-10 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Open Scanner</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              type="button"
              className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-on-error-container font-label-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear active session scans"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Clear Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[20px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Search scans by material, resin code, or stream..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-sm border border-outline-variant/30 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="font-label-sm text-xs text-on-surface-variant whitespace-nowrap">Filter:</span>
          {['all', 'plastic', 'paper', 'metal', 'uncertain'].map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => setStreamFilter(token)}
              className={`px-3 py-1.5 rounded-full font-label-sm text-xs font-semibold capitalize transition-all cursor-pointer ${
                streamFilter === token
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* History Table Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-[32px]">manage_search</span>
            </div>
            <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
              {history.length === 0 ? 'No scans in this session yet' : 'No matching scans found'}
            </h3>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-sm mt-1">
              {history.length === 0
                ? 'Return to the Waste Scanner and run a 5-second scan to see classification logs here.'
                : 'Try adjusting your search terms or filter selection.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg font-semibold">Item &amp; Snapshot</th>
                  <th className="py-3 px-4 font-semibold">Trained Class</th>
                  <th className="py-3 px-4 font-semibold">Confidence Breakdown</th>
                  <th className="py-3 px-4 font-semibold">Disposal Recommendation</th>
                  <th className="py-3 px-4 font-semibold">Latency</th>
                  <th className="py-3 px-4 rounded-r-lg font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-on-surface font-body-md text-sm">
                {filteredHistory.map((scan) => {
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
                      onClick={() => onSelectScan(scan)}
                      className="hover:bg-surface-container-low/60 transition-colors cursor-pointer border-b border-outline-variant/10 last:border-b-0"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 overflow-hidden border border-outline-variant/30">
                          {scan.image ? (
                            <img
                              src={scan.image}
                              alt={scan.category}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">
                              {scan.guidance.icon}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">
                            {scan.displayName}
                          </span>
                          <span className="font-code-sm text-xs text-outline">
                            {scan.guidance.materialCode}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-xs bg-surface-container-high text-on-surface font-semibold">
                          {scan.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-code-sm text-xs font-bold text-on-surface w-9">
                            {confPercent}%
                          </span>
                          <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh ? 'bg-primary' : isMed ? 'bg-amber-600' : 'bg-error'
                              }`}
                              style={{ width: `${confPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-on-surface-variant max-w-xs">
                        {scan.guidance.immediateAction}
                      </td>

                      <td className="py-3 px-4 font-code-sm text-xs text-outline">
                        {scan.latencyMs}ms
                      </td>

                      <td className="py-3 px-4 text-right font-code-sm text-xs text-outline whitespace-nowrap">
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
    </div>
  )
}
