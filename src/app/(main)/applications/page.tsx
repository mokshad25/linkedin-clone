import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApplicationsClient from '@/components/jobs/ApplicationsClient'

export const metadata = { title: 'My Applications | LinkedIn' }

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs!applications_job_id_fkey(
        id, title, type, work_mode, location,
        company:companies!jobs_company_id_fkey(id, name, logo_url)
      )
    `)
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })

  return <ApplicationsClient applications={data ?? []} />
}