export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'student' | 'recruiter' | 'admin'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'selected'
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected'
export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance'
export type WorkMode = 'onsite' | 'remote' | 'hybrid'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Omit<Profile, 'created_at' | 'updated_at'>
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>
            }
            user_roles: {
                Row: UserRoleRecord
                Insert: Omit<UserRoleRecord, 'created_at'>
                Update: Partial<UserRoleRecord>
            }
            posts: {
                Row: Post
                Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Post, 'id' | 'created_at'>>
            }
            post_likes: {
                Row: PostLike
                Insert: PostLike
                Update: never
            }
            post_comments: {
                Row: PostComment
                Insert: Omit<PostComment, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<PostComment, 'id' | 'created_at'>>
            }
            connections: {
                Row: Connection
                Insert: Omit<Connection, 'id' | 'created_at'>
                Update: Partial<Connection>
            }
            companies: {
                Row: Company
                Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Company, 'id' | 'created_at'>>
            }
            jobs: {
                Row: Job
                Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Job, 'id' | 'created_at'>>
            }
            applications: {
                Row: Application
                Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Application, 'id' | 'created_at'>>
            }
            skills: {
                Row: Skill
                Insert: Omit<Skill, 'id'>
                Update: Partial<Skill>
            }
            notifications: {
                Row: Notification
                Insert: Omit<Notification, 'id' | 'created_at'>
                Update: Partial<Notification>
            },
            saved_jobs: {
                Row: SavedJob
                Insert: SavedJob
                Update: never
            },
            job_skills: {
                Row: JobSkill
                Insert: JobSkill
                Update: never
            }
        },
        Views: {
            admin_stats: {
                Row: AdminStats
            }
            daily_signups: {
                Row: DailyCount
            }
            daily_posts: {
                Row: DailyCount
            }
        }
    }
}

export interface Profile {
    id: string
    username: string | null
    full_name: string | null
    headline: string | null
    about: string | null
    location: string | null
    avatar_url: string | null
    banner_url: string | null
    resume_url: string | null
    website: string | null
    github_url: string | null
    linkedin_url: string | null
    twitter_url: string | null
    phone: string | null
    is_open_to_work: boolean
    profile_completion: number
    created_at: string
    updated_at: string
}

export interface UserRoleRecord {
    id: string
    user_id: string
    role: UserRole
    created_at: string
}

export interface Post {
    id: string
    author_id: string
    content: string
    image_url: string | null
    is_edited: boolean
    likes_count: number
    comments_count: number
    created_at: string
    updated_at: string
}

export interface PostLike {
    post_id: string
    user_id: string
    created_at: string
}

export interface PostComment {
    id: string
    post_id: string
    author_id: string
    content: string
    is_edited: boolean
    created_at: string
    updated_at: string
}

export interface Connection {
    id: string
    requester_id: string
    receiver_id: string
    status: ConnectionStatus
    created_at: string
    updated_at: string
}

export interface Education {
    id: string
    user_id: string
    school: string
    degree: string | null
    field_of_study: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean
    description: string | null
    created_at: string
}

export interface Experience {
    id: string
    user_id: string
    company: string
    title: string
    location: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean
    description: string | null
    created_at: string
}

export interface Certification {
    id: string
    user_id: string
    name: string
    issuer: string
    issue_date: string | null
    expiry_date: string | null
    credential_url: string | null
    created_at: string
}

export interface Project {
    id: string
    user_id: string
    title: string
    description: string | null
    url: string | null
    image_url: string | null
    start_date: string | null
    end_date: string | null
    created_at: string
}

export interface Skill {
    id: string
    name: string
    slug: string
}

export interface UserSkill {
    user_id: string
    skill_id: string
    proficiency: 'beginner' | 'intermediate' | 'expert' | null
}

export interface Company {
    id: string
    owner_id: string
    name: string
    slug: string
    logo_url: string | null
    banner_url: string | null
    description: string | null
    industry: string | null
    size: string | null
    website: string | null
    location: string | null
    founded_year: number | null
    is_verified: boolean
    created_at: string
    updated_at: string
}

export interface Job {
    id: string
    company_id: string
    posted_by: string
    title: string
    description: string
    requirements: string | null
    location: string | null
    type: JobType
    work_mode: WorkMode
    salary_min: number | null
    salary_max: number | null
    experience_required: string | null
    is_active: boolean
    deadline: string | null
    applications_count: number
    created_at: string
    updated_at: string
}

export interface Application {
    id: string
    job_id: string
    applicant_id: string
    status: ApplicationStatus
    cover_letter: string | null
    resume_url: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

export interface SavedJob {
    job_id: string
    user_id: string
    created_at: string
}

export interface Notification {
    id: string
    user_id: string
    actor_id: string | null
    type: string
    message: string
    resource_id: string | null
    resource_type: string | null
    is_read: boolean
    created_at: string
}

export interface JobSkill {
    job_id: string
    skill_id: string
}

export interface AdminStats {
    total_users: number | null
    total_posts: number | null
    total_jobs: number | null
    total_applications: number | null
    total_companies: number | null
    new_users_today: number | null
    new_posts_today: number | null
}

export interface DailyCount {
    date: string
    count: number
}

export interface AdminLog {
    id: string
    admin_id: string
    action: string
    target_type: string
    target_id: string | null
    metadata: Json | null
    created_at: string
}