import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JobsClient from '@/components/jobs/JobsClient'

export const metadata = { title: 'Jobs | LinkedIn' }

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; mode?: string; location?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let query = supabase
    .from('jobs')
    .select(`
      *,
      company:companies!jobs_company_id_fkey(id, name, logo_url, location, slug),
      skills:job_skills(skill:skills(id, name))
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }
  if (searchParams.type) {
    query = query.eq('type', searchParams.type)
  }
  if (searchParams.mode) {
    query = query.eq('work_mode', searchParams.mode)
  }
  if (searchParams.location) {
    query = query.ilike('location', `%${searchParams.location}%`)
  }

  const { data: jobs } = await query.limit(30)

  // Get saved jobs and applications for this user
  const jobIds = (jobs ?? []).map((j) => j.id)

  const [savedRes, appliedRes] = await Promise.all([
    supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id)
      .in('job_id', jobIds.length ? jobIds : ['00000000-0000-0000-0000-000000000000']),
    supabase
      .from('applications')
      .select('job_id, status')
      .eq('applicant_id', user.id)
      .in('job_id', jobIds.length ? jobIds : ['00000000-0000-0000-0000-000000000000']),
  ])

  const savedSet = new Set((savedRes.data ?? []).map((s) => s.job_id))
  const appliedMap = new Map(
    (appliedRes.data ?? []).map((a) => [a.job_id, a.status])
  )

  const enrichedJobs = (jobs ?? []).map((j) => ({
    ...j,
    is_saved: savedSet.has(j.id),
    has_applied: appliedMap.has(j.id),
    application_status: appliedMap.get(j.id) ?? null,
  }))

  return (
    <JobsClient
      jobs={enrichedJobs}
      currentUserId={user.id}
      filters={searchParams}
    />
  )
}