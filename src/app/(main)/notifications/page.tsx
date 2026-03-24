import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NotificationsClient from '@/components/notifications/NotificationsClient'

export const metadata = { title: 'Notifications | LinkedIn' }

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:profiles!notifications_actor_id_fkey(
        id, full_name, avatar_url, username, headline
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Mark all as read after fetching
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <NotificationsClient
      notifications={notifications ?? []}
      currentUserId={user.id}
    />
  )
}