'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { JobWithCompany } from '@/types/jobs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime, formatSalary } from '@/lib/utils'
import { APPLICATION_STATUSES, JOB_TYPES, WORK_MODES } from '@/lib/constants'
import {
  MapPinIcon,
  BookmarkIcon,
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  CheckCircle2Icon,
} from 'lucide-react'

interface Props {
  job: JobWithCompany
  currentUserId: string
  onSaveToggle: (jobId: string, isSaved: boolean) => void
  onApplied: (jobId: string) => void
  showApplyButton?: boolean
}

export default function JobCard({
  job,
  currentUserId,
  onSaveToggle,
  onApplied,
  showApplyButton = true,
}: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.type)?.label ?? job.type
  const workModeLabel = WORK_MODES.find((m) => m.value === job.work_mode)?.label ?? job.work_mode
  const statusConfig = APPLICATION_STATUSES.find((s) => s.value === job.application_status)

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaving(true)
    const supabase = createClient()

    if (job.is_saved) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', job.id)
        .eq('user_id', currentUserId)
      onSaveToggle(job.id, false)
      toast.success('Job removed from saved')
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ job_id: job.id, user_id: currentUserId })
      onSaveToggle(job.id, true)
      toast.success('Job saved!')
    }
    setIsSaving(false)
  }

  const handleCardClick = () => {
    router.push(`/jobs/${job.id}`)
  }

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/jobs/${job.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">

        {/* Company logo */}
        <div className="w-12 h-12 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.company.logo_url ? (
            <img
              src={job.company.logo_url}
              alt={job.company.name}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <BuildingIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#0a66c2] transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">{job.company.name}</p>
            </div>

            {/* Save button — stops propagation so card click doesn't fire */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`shrink-0 p-1.5 rounded-full transition-colors ${
                job.is_saved
                  ? 'text-[#0a66c2] hover:bg-blue-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookmarkIcon
                className={`w-4 h-4 ${job.is_saved ? 'fill-[#0a66c2]' : ''}`}
              />
            </button>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {job.location && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPinIcon className="w-3.5 h-3.5" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <BriefcaseIcon className="w-3.5 h-3.5" />
              {jobTypeLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ClockIcon className="w-3.5 h-3.5" />
              {workModeLabel}
            </span>
          </div>

          {/* Salary */}
          {(job.salary_min || job.salary_max) && (
            <p className="text-xs font-medium text-slate-700 mt-1.5">
              {formatSalary(job.salary_min, job.salary_max)} / year
            </p>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.skills.slice(0, 4).map(({ skill }: any) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-600 border-0"
                >
                  {skill.name}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-500 border-0"
                >
                  +{job.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">
              {formatRelativeTime(job.created_at)}
              {' · '}
              {job.applications_count} applicant
              {job.applications_count !== 1 ? 's' : ''}
            </span>

            {job.has_applied ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    statusConfig?.color ?? 'bg-green-100 text-green-700'
                  }`}
                >
                  {statusConfig?.label ?? 'Applied'}
                </span>
              </div>
            ) : showApplyButton ? (
              /* 
                IMPORTANT: This is a plain <button> not a <Link> because
                the entire card is already clickable (goes to job detail).
                Using <Link> here would create <a> inside <a> — invalid HTML.
              */
              <button
                onClick={handleApplyClick}
                className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs h-7 px-3 transition-colors"
              >
                Apply
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}