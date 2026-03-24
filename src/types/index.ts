export * from './database'

// Extended types with joins
export interface ProfileWithRole extends Profile {
    role: UserRole
}

export interface PostWithAuthor extends Post {
    author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'headline' | 'username'>
    is_liked?: boolean
}

export interface JobWithCompany extends Job {
    company: Pick<Company, 'id' | 'name' | 'logo_url' | 'location'>
    is_saved?: boolean
    has_applied?: boolean
}

export interface ApplicationWithJob extends Application {
    job: JobWithCompany
}

export interface ConnectionWithProfile extends Connection {
    profile: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'headline' | 'username'>
}

// Re-export type imports
import type {
    Profile, Post, Job, Company, Application,
    Connection, Notification, UserRole
} from './database'