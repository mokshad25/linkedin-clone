import { createClient } from './client'
import { SUPABASE_STORAGE } from '../constants'

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
        .from(SUPABASE_STORAGE.AVATARS)
        .upload(path, file, { upsert: true, contentType: file.type })

    if (error) { console.error('Avatar upload error:', error); return null }

    const { data } = supabase.storage.from(SUPABASE_STORAGE.AVATARS).getPublicUrl(path)
    return data.publicUrl
}

export async function uploadBanner(userId: string, file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/banner.${ext}`

    const { error } = await supabase.storage
        .from(SUPABASE_STORAGE.BANNERS)
        .upload(path, file, { upsert: true, contentType: file.type })

    if (error) { console.error('Banner upload error:', error); return null }

    const { data } = supabase.storage.from(SUPABASE_STORAGE.BANNERS).getPublicUrl(path)
    return data.publicUrl
}

export async function uploadResume(userId: string, file: File): Promise<string | null> {
    const supabase = createClient()
    const path = `${userId}/resume.pdf`

    const { error } = await supabase.storage
        .from(SUPABASE_STORAGE.RESUMES)
        .upload(path, file, { upsert: true, contentType: 'application/pdf' })

    if (error) { console.error('Resume upload error:', error); return null }

    const { data } = supabase.storage.from(SUPABASE_STORAGE.RESUMES).getPublicUrl(path)
    return data.publicUrl
}