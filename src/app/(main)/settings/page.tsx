import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/components/settings/SettingsClient'

export const metadata = { title: 'Settings | LinkedIn' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, roleRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_roles').select('role').eq('user_id', user.id).single(),
  ])

  return (
    <SettingsClient
      profile={profileRes.data}
      role={roleRes.data?.role ?? 'student'}
      email={user.email ?? ''}
      userId={user.id}
    />
  )
}