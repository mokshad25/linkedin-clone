import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { UserRole, Profile } from '@/types/database'

interface AuthStore {
    user: User | null
    profile: Profile | null
    role: UserRole | null
    isLoading: boolean
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
    setRole: (role: UserRole | null) => void
    setLoading: (loading: boolean) => void
    reset: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setRole: (role) => set({ role }),
    setLoading: (isLoading) => set({ isLoading }),
    reset: () => set({ user: null, profile: null, role: null, isLoading: false }),
}))