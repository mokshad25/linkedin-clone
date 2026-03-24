import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminCompaniesClient from '@/components/admin/AdminCompaniesClient'

export const metadata = { title: 'Companies | Admin' }

export default async function AdminCompaniesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: companies } = await supabase
    .from('companies')
    .select(`
      *,
      owner:profiles!companies_owner_id_fkey(id, full_name, username),
      jobs_count:jobs(count)
    `)
    .order('created_at', { ascending: false })

  return <AdminCompaniesClient companies={companies ?? []} />
}