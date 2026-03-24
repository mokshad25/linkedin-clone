import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ApplicantsClient from '@/components/recruiter/ApplicantsClient'

export const metadata = { title: 'Applicants | LinkedIn' }

export default async function ApplicantsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('posted_by', user.id)
    .single()

  if (!job) notFound()

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      applicant:profiles!applications_applicant_id_fkey(
        id, full_name, avatar_url, headline, username, location, resume_url
      )
    `)
    .eq('job_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <ApplicantsClient
      job={job}
      applications={applications ?? []}
    />
  )
}