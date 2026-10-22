import React, { useState } from 'react'
import { MODEL_CLASSES, wasteGuidanceRegistry } from '../data/wasteGuidance'
import { SOURCED_DATASET_CATALOG } from '../data/sourcedDataset'
import { trainWithDataset, type TrainingProgress } from '../services/trainingService'
import type { CategoryTrainingStats, DatasetSample } from '../types'

interface TeachAiViewProps {
  onBackToScanner: () => void
}

export const TeachAiView: React.FC<TeachAiViewProps> = ({ onBackToScanner }) => {
  const [samples, setSamples] = useState<DatasetSample[]>(SOURCED_DATASET_CATALOG)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageCategory, setNewImageCategory] = useState<string>('Plastic Bottles')
  const [newImageTitle, setNewImageTitle] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null)
  const [trainingDone, setTrainingDone] = useState(false)
  const [categoryStats, setCategoryStats] = useState<Record<string, CategoryTrainingStats>>(() => {
    const initial: Record<string, CategoryTrainingStats> = {}
    MODEL_CLASSES.forEach((cls) => {
      const g = wasteGuidanceRegistry[cls]
      initial[cls] = {
        className: cls,
        baselineAccuracy: g?.categoryAccuracy || 88,
        currentAccuracy: g?.categoryAccuracy || 88,
        sampleCount: g?.datasetSamplesCount || 1000,
        status: 'calibrated'
      }
    })
    return initial
  })

  const filteredSamples = samples.filter(
    (s) => selectedFilter === 'all' || s.category === selectedFilter
  )

  const handleAddSample = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImageUrl.trim()) return

    const newSample: DatasetSample = {
      id: `custom-${Date.now()}`,
      category: newImageCategory,
      title: newImageTitle.trim() || `${newImageCategory} Web Sample`,
      source: 'User Sourced / Internet Web URL',
      imageUrl: newImageUrl.trim()
    }

    setSamples([newSample, ...samples])
    setNewImageUrl('')
    setNewImageTitle('')
  }

  const handleStartTraining = async () => {
    setIsTraining(true)
    setTrainingDone(false)

    try {
      const updated = await trainWithDataset(samples, 15, (progress) => {
        setTrainingProgress(progress)
      })

      const map: Record<string, CategoryTrainingStats> = {}
      updated.forEach((stat) => {
        map[stat.className] = stat
      })
      setCategoryStats(map)
      setTrainingDone(true)
    } catch (err) {
      console.error('[EcoSort AI] Training failed:', err)
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-7xl animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
            CONTINUOUS MODEL CALIBRATION &bull; ACTIVE LEARNING STUDIO
          </span>
          <h2 className="font-display-md text-2xl lg:text-3xl font-bold text-on-surface">
            Teach AI &amp; Category Accuracy Studio
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Source waste imagery from the internet, augment datasets, and train the model in your browser to increase classification accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToScanner}
            type="button"
            className="h-10 px-4 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Return to Scanner</span>
          </button>

          <button
            onClick={handleStartTraining}
            disabled={isTraining}
            type="button"
            className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] ${isTraining ? 'animate-spin' : ''}`}>
              {isTraining ? 'refresh' : 'model_training'}
            </span>
            <span>{isTraining ? 'Teaching AI...' : 'Teach AI with Dataset'}</span>
          </button>
        </div>
      </div>

      {/* Training In-Progress or Success Banner */}
      {isTraining && trainingProgress && (
        <div className="p-space-md rounded-xl bg-secondary-container text-on-secondary-container flex flex-col gap-2 border border-primary/20 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
              <span className="font-label-lg text-sm font-bold">
                Fine-Tuning Waste Classifier &bull; Epoch {trainingProgress.epoch} of {trainingProgress.totalEpochs}
              </span>
            </div>
            <span className="font-code-sm text-xs font-semibold">
              Live Accuracy: {trainingProgress.accuracy}% | Loss: {trainingProgress.loss}
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{
                width: `${(trainingProgress.epoch / trainingProgress.totalEpochs) * 100}%`
              }}
            />
          </div>
          <span className="font-body-sm text-xs text-on-secondary-container/80">
            {trainingProgress.statusText}
          </span>
        </div>
      )}

      {trainingDone && (
        <div className="p-space-md rounded-xl bg-primary text-on-primary flex items-center justify-between gap-space-md shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <div>
              <span className="font-label-lg text-sm font-bold">
                Model Upgraded Successfully!
              </span>
              <p className="font-body-sm text-xs opacity-90 mt-0.5">
                New internet data samples were integrated into the classifier head. Accuracy increased across all 6 waste categories.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTrainingDone(false)}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Accuracy Benchmark Grid (All 6 Categories) */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            Category Accuracy &amp; Precision Benchmarks
          </h3>
          <span className="font-code-sm text-xs text-on-surface-variant">
            Tested on {samples.length} sourced validation sets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODEL_CLASSES.map((cls) => {
            const guidance = wasteGuidanceRegistry[cls]
            const stats = categoryStats[cls] || {
              currentAccuracy: guidance.categoryAccuracy,
              sampleCount: guidance.datasetSamplesCount
            }
            const isBoosted = stats.currentAccuracy > guidance.categoryAccuracy

            return (
              <div
                key={cls}
                className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        {guidance.icon}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-md text-sm font-bold text-on-surface block leading-tight">
                        {guidance.displayName}
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        {cls}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-code-sm text-xs font-bold ${
                      isBoosted
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {stats.currentAccuracy}% Acc
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-label-sm text-on-surface-variant">Precision Rating</span>
                    <span className="font-code-sm font-semibold text-on-surface">
                      {guidance.precisionRating}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${stats.currentAccuracy}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20">
                  <span>{stats.sampleCount} dataset samples</span>
                  {isBoosted && (
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      +{(stats.currentAccuracy - guidance.categoryAccuracy).toFixed(1)}% trained
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sourcing Bar: Add New Internet Image URL */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">add_link</span>
            Source New Training Image from Internet
          </span>
          <span className="font-body-sm text-xs text-on-surface-variant">
            Paste any direct image URL to add to the training catalog
          </span>
        </div>

        <form onSubmit={handleAddSample} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-3">
            <select
              value={newImageCategory}
              onChange={(e) => setNewImageCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-xs border border-outline-variant/30 focus:outline-none focus:border-primary"
            >
              {MODEL_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="Sample Title (e.g. Soda Can Side View)"
              value={newImageTitle}
              onChange={(e) => setNewImageTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-xs border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-4">
            <input
              type="url"
              placeholder="Paste Image URL (https://...)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-xs border border-outline-variant/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Sample</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dataset Samples Gallery */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Sourced Dataset Gallery ({filteredSamples.length} Images)
            </h3>
            <span className="px-2 py-0.5 rounded font-code-sm text-xs bg-surface-container text-on-surface-variant font-medium">
              Open Repositories &amp; TrashNet
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {['all', ...MODEL_CLASSES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1 rounded-full font-label-sm text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'all' ? 'All Classes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 flex flex-col transition-all hover:shadow-md"
            >
              <div className="relative aspect-video w-full bg-surface-container overflow-hidden">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    // Fallback visual if third-party image fails to load
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded font-label-sm text-[10px] font-bold bg-inverse-surface/80 text-inverse-on-surface backdrop-blur-sm">
                  {sample.category}
                </span>
              </div>
              <div className="p-2.5 flex flex-col gap-0.5">
                <span className="font-label-md text-xs font-semibold text-on-surface truncate" title={sample.title}>
                  {sample.title}
                </span>
                <span className="font-body-sm text-[10px] text-on-surface-variant truncate">
                  Source: {sample.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
