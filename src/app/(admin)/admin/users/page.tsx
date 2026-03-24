import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminUsersClient from '@/components/admin/AdminUsersClient'

export const metadata = { title: 'User Management | Admin' }

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; page?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const page = parseInt(searchParams.page ?? '1')
  const pageSize = 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from('profiles')
    .select(`
      *,
      role:user_roles!user_roles_user_id_fkey(role)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (searchParams.q) {
    query = query.ilike('full_name', `%${searchParams.q}%`)
  }

  const { data: users, count } = await query

  return (
    <AdminUsersClient
      users={users ?? []}
      total={count ?? 0}
      page={page}
      pageSize={pageSize}
      filters={searchParams}
    />
  )
}