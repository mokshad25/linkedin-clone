import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SearchClient from '@/components/search/SearchClient'

export const metadata = { title: 'Search | LinkedIn' }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const query = searchParams.q?.trim() ?? ''
  const type = searchParams.type ?? 'all'

  if (!query) {
    return <SearchClient query="" type={type} results={null} currentUserId={user.id} />
  }

  const searchTerm = `%${query}%`

  const [peopleRes, jobsRes, companiesRes, postsRes] = await Promise.all([
    // People search
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, headline, location, username')
      .neq('id', user.id)
      .or(`full_name.ilike.${searchTerm},headline.ilike.${searchTerm},location.ilike.${searchTerm}`)
      .not('full_name', 'is', null)
      .limit(20),

    // Jobs search
    supabase
      .from('jobs')
      .select(`
        id, title, type, work_mode, location, salary_min, salary_max,
        created_at, applications_count, is_active,
        company:companies!jobs_company_id_fkey(id, name, logo_url, slug)
      `)
      .eq('is_active', true)
      .or(`title.ilike.${searchTerm},location.ilike.${searchTerm}`)
      .limit(20),

    // Companies search
    supabase
      .from('companies')
      .select('id, name, slug, logo_url, industry, location, size, description')
      .or(`name.ilike.${searchTerm},industry.ilike.${searchTerm},location.ilike.${searchTerm}`)
      .limit(10),

    // Posts search
    supabase
      .from('posts')
      .select(`
        id, content, image_url, likes_count, comments_count, created_at,
        author:profiles!posts_author_id_fkey(id, full_name, avatar_url, headline, username)
      `)
      .ilike('content', searchTerm)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Get connection statuses for people results
  const peopleIds = (peopleRes.data ?? []).map((p) => p.id)
  const { data: connections } = peopleIds.length
    ? await supabase
        .from('connections')
        .select('requester_id, receiver_id, status, id')
        .or(
          `and(requester_id.eq.${user.id},receiver_id.in.(${peopleIds.join(',')})),` +
          `and(receiver_id.eq.${user.id},requester_id.in.(${peopleIds.join(',')}))`
        )
    : { data: [] }

  const connectionMap = new Map(
    (connections ?? []).map((c) => {
      const otherId = c.requester_id === user.id ? c.receiver_id : c.requester_id
      return [otherId, { status: c.status, id: c.id, requesterId: c.requester_id }]
    })
  )

  const enrichedPeople = (peopleRes.data ?? []).map((p) => {
    const conn = connectionMap.get(p.id)
    let connectionStatus = 'none'
    if (conn) {
      if (conn.status === 'accepted') connectionStatus = 'accepted'
      else if (conn.status === 'pending') {
        connectionStatus = conn.requesterId === user.id ? 'pending_sent' : 'pending_received'
      }
    }
    return { ...p, connectionStatus, connectionId: conn?.id ?? null }
  })

  return (
    <SearchClient
      query={query}
      type={type}
      currentUserId={user.id}
      results={{
        people: enrichedPeople,
        jobs: (jobsRes.data ?? []).map((j) => ({
          ...j,
          is_saved: false,
          has_applied: false,
        })),
        companies: companiesRes.data ?? [],
        posts: postsRes.data ?? [],
      }}
    />
  )
}