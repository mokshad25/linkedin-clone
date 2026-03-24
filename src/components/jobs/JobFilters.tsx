'use client'

import { useRouter } from 'next/navigation'
import { JOB_TYPES, WORK_MODES } from '@/lib/constants'

interface Props {
  currentFilters: { q?: string; type?: string; mode?: string; location?: string }
}

export default function JobFilters({ currentFilters }: Props) {
  const router = useRouter()

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (currentFilters.q) params.set('q', currentFilters.q)
    if (currentFilters.type) params.set('type', currentFilters.type)
    if (currentFilters.mode) params.set('mode', currentFilters.mode)
    if (currentFilters.location) params.set('location', currentFilters.location)

    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/jobs?${params.toString()}`)
  }

  const clearAll = () => router.push('/jobs')

  const hasFilters = currentFilters.type || currentFilters.mode || currentFilters.location

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#0a66c2] hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Job Type */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Job Type
        </p>
        <div className="space-y-1.5">
          {JOB_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentFilters.type === value}
                onChange={() => applyFilter('type', value)}
                className="w-4 h-4 accent-[#0a66c2]"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Work Mode
        </p>
        <div className="space-y-1.5">
          {WORK_MODES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentFilters.mode === value}
                onChange={() => applyFilter('mode', value)}
                className="w-4 h-4 accent-[#0a66c2]"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}