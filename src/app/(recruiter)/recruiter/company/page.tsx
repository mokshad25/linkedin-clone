import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompanyFormClient from '@/components/recruiter/CompanyFormClient'

export const metadata = { title: 'Company Profile | LinkedIn' }

export default async function CompanyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recruiter } = await supabase
    .from('recruiter_profiles')
    .select('*, company:companies(*)')
    .eq('user_id', user.id)
    .single()

  return (
    <CompanyFormClient
      userId={user.id}
      recruiterId={recruiter?.id ?? null}
      existingCompany={recruiter?.company ?? null}
    />
  )
}