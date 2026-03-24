'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false)
    const { setUser, setProfile, setRole, setLoading, reset } = useAuthStore.getState()

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const supabase = createClient()

        const loadUserData = async () => {
            setLoading(true)

            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                reset()
                return
            }

            setUser(user)

            const [profileRes, roleRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('user_roles').select('role').eq('user_id', user.id).single(),
            ])

            setProfile(profileRes.data ?? null)
            setRole(roleRes.data?.role ?? 'student')
            setLoading(false)
        }

        loadUserData()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    reset()
                    return
                }
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await loadUserData()
                }
            }
        )

        return () => subscription.unsubscribe()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <>{children}</>
}