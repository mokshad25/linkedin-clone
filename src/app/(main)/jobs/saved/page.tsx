import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SavedJobsClient from '@/components/jobs/SavedJobsClient'

export const metadata = { title: 'Saved Jobs | LinkedIn' }

export default async function SavedJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('saved_jobs')
    .select(`
      job_id,
      created_at,
      job:jobs!saved_jobs_job_id_fkey(
        *,
        company:companies!jobs_company_id_fkey(id, name, logo_url, location, slug),
        skills:job_skills(skill:skills(id, name))
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const jobs = (data ?? [])
    .map((s) => s.job)
    .filter(Boolean)
    .map((j) => ({ ...j, is_saved: true, has_applied: false }))

  return <SavedJobsClient jobs={jobs} currentUserId={user.id} />
}