import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminModerationClient from '@/components/admin/AdminModerationClient'

export const metadata = { title: 'Content Moderation | Admin' }

export default async function AdminModerationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(
        id, full_name, avatar_url, username
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return <AdminModerationClient posts={posts ?? []} />
}