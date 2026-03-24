'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/types/database'

interface AuthState {
    user: User | null
    role: UserRole | null
    isLoading: boolean
}

export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>({
        user: null,
        role: null,
        isLoading: true,
    })

    useEffect(() => {
        const supabase = createClient()

        const fetchUserAndRole = async (user: User | null) => {
            if (!user) {
                setState({ user: null, role: null, isLoading: false })
                return
            }
            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .single()

            setState({
                user,
                role: (data?.role as UserRole) ?? 'student',
                isLoading: false,
            })
        }

        // Initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            fetchUserAndRole(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                fetchUserAndRole(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    return state
}