import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import JobFormClient from '@/components/recruiter/JobFormClient'

export const metadata = { title: 'Edit Job | LinkedIn' }

export default async function EditJobPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [jobRes, recruiterRes, allSkillsRes] = await Promise.all([
    supabase
      .from('jobs')
      .select(`
        *,
        skills:job_skills(skill:skills(id, name))
      `)
      .eq('id', params.id)
      .eq('posted_by', user.id)
      .single(),
    supabase
      .from('recruiter_profiles')
      .select('*, company:companies(*)')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('skills')
      .select('*')
      .order('name'),
  ])

  // If job not found or doesn't belong to this recruiter
  if (!jobRes.data) notFound()
  if (!recruiterRes.data?.company) redirect('/recruiter/company')

  return (
    <JobFormClient
      userId={user.id}
      companyId={recruiterRes.data.company.id}
      companyName={recruiterRes.data.company.name}
      allSkills={allSkillsRes.data ?? []}
      existingJob={jobRes.data}
    />
  )
}