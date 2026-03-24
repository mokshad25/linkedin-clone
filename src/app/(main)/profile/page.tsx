import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/profile/EditProfileForm'

export const metadata = { title: 'Edit Profile' }

export default async function EditProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const [profileRes, eduRes, expRes, certRes, projRes, skillsRes, allSkillsRes] =
        await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
            supabase.from('experience').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
            supabase.from('certifications').select('*').eq('user_id', user.id).order('issue_date', { ascending: false }),
            supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabase.from('user_skills').select('*, skill:skills(*)').eq('user_id', user.id),
            supabase.from('skills').select('*').order('name'),
        ])

    return (
        <EditProfileForm
            profile={profileRes.data}
            education={eduRes.data ?? []}
            experience={expRes.data ?? []}
            certifications={certRes.data ?? []}
            projects={projRes.data ?? []}
            userSkills={skillsRes.data ?? []}
            allSkills={allSkillsRes.data ?? []}
            userId={user.id}
        />
    )
}