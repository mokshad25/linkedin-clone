import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export const metadata = { title: 'Admin Dashboard | LinkedIn' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [statsRes, signupsRes, postsChartRes, recentUsersRes, recentPostsRes] =
    await Promise.all([
      supabase.from('admin_stats').select('*').single(),
      supabase.from('daily_signups').select('*'),
      supabase.from('daily_posts').select('*'),
      supabase
        .from('profiles')
        .select('id, full_name, avatar_url, headline, created_at, username')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('posts')
        .select(`
          id, content, likes_count, comments_count, created_at,
          author:profiles!posts_author_id_fkey(id, full_name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  return (
    <AdminDashboardClient
      stats={statsRes.data}
      signupChart={signupsRes.data ?? []}
      postsChart={postsChartRes.data ?? []}
      recentUsers={recentUsersRes.data ?? []}
      recentPosts={recentPostsRes.data ?? []}
    />
  )
}