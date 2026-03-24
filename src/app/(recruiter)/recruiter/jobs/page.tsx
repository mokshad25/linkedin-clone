import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JOB_TYPES, WORK_MODES } from '@/lib/constants'
import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  PencilIcon,
  MapPinIcon,
} from 'lucide-react'

export const metadata = { title: 'My Job Postings | LinkedIn' }

export default async function RecruiterJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies!jobs_company_id_fkey(id, name, logo_url)
    `)
    .eq('posted_by', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">My Job Postings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {jobs?.length ?? 0} job{jobs?.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        <Link href="/recruiter/jobs/create">
          <Button
            size="sm"
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Post a job
          </Button>
        </Link>
      </div>

      {/* Jobs list */}
      {!jobs || jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <BriefcaseIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No jobs posted yet</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Post your first job to start receiving applications from qualified candidates.
          </p>
          <Link href="/recruiter/jobs/create">
            <Button
              size="sm"
              className="mt-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              Post your first job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.type)?.label ?? job.type
            const workModeLabel = WORK_MODES.find((m) => m.value === job.work_mode)?.label ?? job.work_mode

            return (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {job.title}
                      </h3>
                      <Badge
                        className={`text-xs font-semibold ${
                          job.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {job.is_active ? 'Active' : 'Closed'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      {job.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">{jobTypeLabel}</span>
                      <span className="text-xs text-slate-500">{workModeLabel}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <UsersIcon className="w-3.5 h-3.5" />
                        {job.applications_count} applicant
                        {job.applications_count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-slate-400">
                        Posted {formatRelativeTime(job.created_at)}
                      </span>
                      {job.deadline && (
                        <span className="text-xs text-slate-400">
                          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-slate-300 text-slate-600 hover:border-[#0a66c2] hover:text-[#0a66c2] text-xs"
                      >
                        <UsersIcon className="w-3.5 h-3.5 mr-1" />
                        Applicants
                      </Button>
                    </Link>
                    <Link href={`/recruiter/jobs/${job.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-slate-300 text-slate-600 hover:border-[#0a66c2] hover:text-[#0a66c2] text-xs"
                      >
                        <PencilIcon className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
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