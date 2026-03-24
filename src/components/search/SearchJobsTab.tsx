import Link from 'next/link'
import { formatSalary, formatRelativeTime } from '@/lib/utils'
import { JOB_TYPES, WORK_MODES } from '@/lib/constants'
import { BuildingIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  jobs: any[]
  currentUserId: string
  showHeader: boolean
}

export default function SearchJobsTab({ jobs, currentUserId, showHeader }: Props) {
  return (
    <div className={showHeader ? 'mt-4 pt-4 border-t border-slate-100' : ''}>
      {showHeader && (
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Jobs ({jobs.length})
        </h3>
      )}

      <div className="space-y-2">
        {jobs.slice(0, showHeader ? 3 : jobs.length).map((job) => {
          const jobType = JOB_TYPES.find((t) => t.value === job.type)?.label
          const workMode = WORK_MODES.find((m) => m.value === job.work_mode)?.label

          return (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {job.company?.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={job.company.name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  ) : (
                    <BuildingIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 hover:text-[#0a66c2] truncate">
                    {job.title}
                  </p>
                  <p className="text-xs text-slate-600">{job.company?.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                    {job.location && (
                      <span className="flex items-center gap-0.5 text-xs text-slate-500">
                        <MapPinIcon className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    {jobType && (
                      <span className="flex items-center gap-0.5 text-xs text-slate-500">
                        <BriefcaseIcon className="w-3 h-3" />
                        {jobType}
                      </span>
                    )}
                    {workMode && (
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500 border-0 py-0">
                        {workMode}
                      </Badge>
                    )}
                  </div>
                  {(job.salary_min || job.salary_max) && (
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatRelativeTime(job.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}