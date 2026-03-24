'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { APPLICATION_STATUSES, JOB_TYPES, WORK_MODES } from '@/lib/constants'
import { BuildingIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  applications: any[]
}

export default function ApplicationsClient({ applications }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <BriefcaseIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No applications yet</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Apply to jobs and track your progress here.
          </p>
          <Link
            href="/jobs"
            className="mt-2 px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusConfig = APPLICATION_STATUSES.find((s) => s.value === app.status)
            const jobType = JOB_TYPES.find((t) => t.value === app.job?.type)?.label
            const workMode = WORK_MODES.find((m) => m.value === app.job?.work_mode)?.label

            return (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {app.job?.company?.logo_url ? (
                      <img
                        src={app.job.company.logo_url}
                        alt={app.job.company.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <BuildingIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/jobs/${app.job_id}`} className="hover:underline">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {app.job?.title ?? 'Unknown Job'}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-600">
                          {app.job?.company?.name ?? 'Unknown Company'}
                        </p>
                      </div>
                      <Badge className={`text-xs font-semibold shrink-0 ${
                        statusConfig?.color ?? 'bg-blue-100 text-blue-700'
                      }`}>
                        {statusConfig?.label ?? app.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {app.job?.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {app.job.location}
                        </span>
                      )}
                      {jobType && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                          {jobType}
                        </span>
                      )}
                      {workMode && (
                        <span className="text-xs text-slate-500">{workMode}</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Applied {formatRelativeTime(app.created_at)}
                    </p>

                    {app.cover_letter && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 bg-slate-50 rounded p-2">
                        {app.cover_letter}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}