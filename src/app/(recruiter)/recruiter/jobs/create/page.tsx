import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JobFormClient from '@/components/recruiter/JobFormClient'

export const metadata = { title: 'Post a Job | LinkedIn' }

export default async function CreateJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recruiter } = await supabase
    .from('recruiter_profiles')
    .select('*, company:companies(*)')
    .eq('user_id', user.id)
    .single()

  if (!recruiter?.company) redirect('/recruiter/company')

  const { data: allSkills } = await supabase.from('skills').select('*').order('name')

  return (
    <JobFormClient
      userId={user.id}
      companyId={recruiter.company.id}
      companyName={recruiter.company.name}
      allSkills={allSkills ?? []}
      existingJob={null}
    />
  )
}