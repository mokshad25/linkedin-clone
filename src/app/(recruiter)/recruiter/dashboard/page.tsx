import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BriefcaseIcon,
  UsersIcon,
  BuildingIcon,
  PlusIcon,
  TrendingUpIcon,
} from 'lucide-react'

export const metadata = { title: 'Recruiter Dashboard | LinkedIn' }

export default async function RecruiterDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recruiterProfile } = await supabase
    .from('recruiter_profiles')
    .select('*, company:companies(*)')
    .eq('user_id', user.id)
    .single()

  const company = recruiterProfile?.company

  const [jobsRes, recentAppsRes] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, title, type, is_active, applications_count, created_at')
      .eq('posted_by', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    company
      ? supabase
          .from('applications')
          .select(`
            *,
            applicant:profiles!applications_applicant_id_fkey(
              id, full_name, avatar_url, headline, username
            ),
            job:jobs!applications_job_id_fkey(id, title)
          `)
          .in(
            'job_id',
            (await supabase
              .from('jobs')
              .select('id')
              .eq('posted_by', user.id)).data?.map((j) => j.id) ?? []
          )
          .order('created_at', { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
  ])

  const jobs = jobsRes.data ?? []
  const recentApps = recentAppsRes.data ?? []

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applications_count ?? 0), 0)
  const activeJobs = jobs.filter((j) => j.is_active).length

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Recruiter Dashboard</h1>
            {company && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                <BuildingIcon className="w-4 h-4" />
                {company.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!company && (
              <Link href="/recruiter/company">
                <Button variant="outline" size="sm" className="rounded-full border-[#0a66c2] text-[#0a66c2]">
                  <BuildingIcon className="w-4 h-4 mr-1.5" />
                  Setup Company
                </Button>
              </Link>
            )}
            <Link href="/recruiter/jobs/create">
              <Button size="sm" className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white">
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Post a job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Active Jobs', value: activeJobs, icon: BriefcaseIcon, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Applicants', value: totalApplicants, icon: UsersIcon, color: 'text-green-600 bg-green-50' },
          { label: 'Total Postings', value: jobs.length, icon: TrendingUpIcon, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Your Job Postings</h2>
            <Link href="/recruiter/jobs" className="text-xs text-[#0a66c2] hover:underline font-medium">
              See all
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No jobs posted yet</p>
              <Link href="/recruiter/jobs/create">
                <Button size="sm" className="mt-2 rounded-full bg-[#0a66c2] text-white text-xs">
                  Post your first job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link key={job.id} href={`/recruiter/jobs/${job.id}/applicants`}>
                  <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#0a66c2] truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.applications_count} applicants · {formatRelativeTime(job.created_at)}
                      </p>
                    </div>
                    <Badge className={`text-xs shrink-0 ml-2 ${
                      job.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {job.is_active ? 'Active' : 'Closed'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Recent Applications</h2>
          </div>

          {recentApps.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentApps.map((app: any) => {
                const statusConfig = APPLICATION_STATUSES.find((s) => s.value === app.status)
                return (
                  <Link key={app.id} href={`/recruiter/jobs/${app.job_id}/applicants`}>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0 overflow-hidden">
                        {app.applicant?.avatar_url
                          ? <img src={app.applicant.avatar_url} className="w-full h-full object-cover" />
                          : (app.applicant?.full_name?.[0] ?? 'U')
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {app.applicant?.full_name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {app.job?.title}
                        </p>
                      </div>
                      <Badge className={`text-xs shrink-0 ${statusConfig?.color ?? 'bg-blue-100 text-blue-700'}`}>
                        {statusConfig?.label ?? app.status}
                      </Badge>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}