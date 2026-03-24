'use client'

import { useState } from 'react'
import { JobWithCompany } from '@/types/jobs'
import JobCard from './JobCard'
import { BookmarkIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Props {
  jobs: JobWithCompany[]
  currentUserId: string
}

export default function SavedJobsClient({ jobs: initialJobs, currentUserId }: Props) {
  const [jobs, setJobs] = useState<JobWithCompany[]>(initialJobs)

  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    if (!isSaved) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId))
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5 text-[#0a66c2]" />
          Saved Jobs
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {jobs.length} saved job{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <BookmarkIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No saved jobs yet</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Save jobs while browsing to review them later.
          </p>
          <Link href="/jobs">
            <Button className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white mt-2">
              Browse jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              currentUserId={currentUserId}
              onSaveToggle={handleSaveToggle}
              onApplied={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}