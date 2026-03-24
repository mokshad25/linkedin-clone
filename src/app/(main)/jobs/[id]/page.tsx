import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import JobDetailClient from '@/components/jobs/JobDetailClient'

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies!jobs_company_id_fkey(id, name, logo_url, location, slug, description, website, industry, size),
      skills:job_skills(skill:skills(id, name))
    `)
    .eq('id', params.id)
    .single()

  if (!job) notFound()

  const [savedRes, appliedRes, profileRes] = await Promise.all([
    supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('job_id', job.id)
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('applications')
      .select('*')
      .eq('job_id', job.id)
      .eq('applicant_id', user.id)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('resume_url')
      .eq('id', user.id)
      .single(),
  ])

  return (
    <JobDetailClient
      job={{
        ...job,
        is_saved: !!savedRes.data,
        has_applied: !!appliedRes.data,
        application_status: appliedRes.data?.status ?? null,
      }}
      existingApplication={appliedRes.data}
      currentUserId={user.id}
      userResumeUrl={profileRes.data?.resume_url ?? null}
    />
  )
}