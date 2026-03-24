import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Education, Experience, Certification, Project, Skill, UserSkill } from '@/types/database'

export interface FullProfile {
    profile: Profile | null
    education: Education[]
    experience: Experience[]
    certifications: Certification[]
    projects: Project[]
    skills: (UserSkill & { skill: Skill })[]
}

export function useProfile(userId: string | undefined) {
    const [data, setData] = useState<FullProfile>({
        profile: null,
        education: [],
        experience: [],
        certifications: [],
        projects: [],
        skills: [],
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!userId) return

        const fetchAll = async () => {
            setIsLoading(true)
            const supabase = createClient()

            const [profileRes, eduRes, expRes, certRes, projRes, skillRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
                supabase.from('experience').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
                supabase.from('certifications').select('*').eq('user_id', userId).order('issue_date', { ascending: false }),
                supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
                supabase.from('user_skills').select('*, skill:skills(*)').eq('user_id', userId),
            ])

            setData({
                profile: profileRes.data,
                education: eduRes.data ?? [],
                experience: expRes.data ?? [],
                certifications: certRes.data ?? [],
                projects: projRes.data ?? [],
                skills: (skillRes.data ?? []) as (UserSkill & { skill: Skill })[],
            })
            setIsLoading(false)
        }

        fetchAll()
    }, [userId])

    return { ...data, isLoading }
}