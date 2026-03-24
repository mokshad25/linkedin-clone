import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NetworkClient from '@/components/network/NetworkClient'

export const metadata = { title: 'My Network | LinkedIn' }

export default async function NetworkPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Pending requests (people who sent requests to me)
    const { data: pendingRaw } = await supabase
        .from('connections')
        .select(`
      *,
      profile:profiles!connections_requester_id_fkey(
        id, full_name, avatar_url, headline, username, location
      )
    `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    // My accepted connections
    const { data: connectionsRaw } = await supabase
        .from('connections')
        .select(`
      *,
      requester:profiles!connections_requester_id_fkey(
        id, full_name, avatar_url, headline, username, location
      ),
      receiver:profiles!connections_receiver_id_fkey(
        id, full_name, avatar_url, headline, username, location
      )
    `)
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('updated_at', { ascending: false })

    // Suggested people — users not connected, not self
    const connectedIds = (connectionsRaw ?? []).map((c) =>
        c.requester_id === user.id ? c.receiver_id : c.requester_id
    )
    const pendingIds = (pendingRaw ?? []).map((c) => c.requester_id)
    const excludeIds = [...connectedIds, ...pendingIds, user.id]

    const { data: suggestedRaw } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, headline, username, location')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .not('full_name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <NetworkClient
            currentUserId={user.id}
            pendingRequests={pendingRaw ?? []}
            connections={connectionsRaw ?? []}
            suggested={suggestedRaw ?? []}
        />
    )
}