import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminAnalyticsClient from '@/components/admin/AdminAnalyticsClient'

export const metadata = { title: 'Analytics | Admin' }

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [statsRes, signupsRes, postsRes, topPostsRes, appStatusRes] = await Promise.all([
    supabase.from('admin_stats').select('*').single(),
    supabase.from('daily_signups').select('*'),
    supabase.from('daily_posts').select('*'),
    supabase
      .from('posts')
      .select(`
        id, content, likes_count, comments_count,
        author:profiles!posts_author_id_fkey(full_name, username)
      `)
      .order('likes_count', { ascending: false })
      .limit(5),
    supabase
      .from('applications')
      .select('status')
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        ;(data ?? []).forEach((a) => {
          counts[a.status] = (counts[a.status] ?? 0) + 1
        })
        return counts
      }),
  ])

  return (
    <AdminAnalyticsClient
      stats={statsRes.data}
      signupChart={signupsRes.data ?? []}
      postsChart={postsRes.data ?? []}
      topPosts={topPostsRes.data ?? []}
      applicationStatusCounts={appStatusRes}
    />
  )
}