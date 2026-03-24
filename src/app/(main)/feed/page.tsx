import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import Feed from '@/components/feed/Feed'

export const metadata = { title: 'Feed | LinkedIn' }

export default async function FeedPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
            <div className="flex gap-4 items-start">
                <aside className="hidden md:block w-60 shrink-0 sticky top-16">
                    <LeftSidebar profile={profile} />
                </aside>

                <section className="flex-1 min-w-0">
                    <Feed currentUserId={user.id} currentUserProfile={profile} />
                </section>

                <aside className="hidden lg:block w-64 shrink-0 sticky top-16">
                    <RightSidebar />
                </aside>
            </div>
        </div>
    )
}