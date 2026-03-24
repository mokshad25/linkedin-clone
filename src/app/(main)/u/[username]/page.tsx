import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProfileView from '@/components/profile/ProfileView'

export default async function PublicProfilePage({
    params,
}: {
    params: { username: string }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', params.username)
        .single()

    if (!profile) notFound()

    const isOwnProfile = user?.id === profile.id

    return <ProfileView userId={profile.id} isOwnProfile={isOwnProfile} />
}