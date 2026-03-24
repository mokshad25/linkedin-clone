'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import JobCard from './JobCard'
import JobFilters from './JobFilters'
import { JobWithCompany } from '@/types/jobs'
import { BriefcaseIcon, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  jobs: JobWithCompany[]
  currentUserId: string
  filters: { q?: string; type?: string; mode?: string; location?: string }
}

export default function JobsClient({ jobs: initialJobs, currentUserId, filters }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(filters.q ?? '')
  const [jobs, setJobs] = useState<JobWithCompany[]>(initialJobs)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (filters.type) params.set('type', filters.type)
    if (filters.mode) params.set('mode', filters.mode)
    if (filters.location) params.set('location', filters.location)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, is_saved: isSaved } : j))
    )
  }

  const handleApplied = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, has_applied: true, application_status: 'applied' } : j
      )
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex gap-4 items-start">

        {/* Left: Filters */}
        <aside className="hidden md:block w-56 shrink-0 sticky top-16">
          <JobFilters currentFilters={filters} />
        </aside>

        {/* Right: Jobs list */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, titles, companies..."
                className="pl-9 h-10 border-slate-200 bg-white"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-md"
            >
              Search
            </Button>
          </form>

          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{jobs.length}</span>{' '}
              job{jobs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Job cards */}
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <BriefcaseIcon className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">No jobs found</p>
              <p className="text-sm text-slate-500 max-w-xs">
                Try adjusting your search filters or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  currentUserId={currentUserId}
                  onSaveToggle={handleSaveToggle}
                  onApplied={handleApplied}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}