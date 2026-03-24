import { Job, Company, Application, Profile } from './database'

export interface JobWithCompany extends Job {
  company: Pick<Company, 'id' | 'name' | 'logo_url' | 'location' | 'slug'>
  skills?: { skill: { id: string; name: string } }[]
  is_saved?: boolean
  has_applied?: boolean
  application_status?: string | null
}

export interface ApplicationWithDetails extends Application {
  job: Pick<Job, 'id' | 'title' | 'type' | 'work_mode' | 'location'>
  company: Pick<Company, 'id' | 'name' | 'logo_url'>
}

export interface ApplicantWithProfile extends Application {
  applicant: Pick<
    Profile,
    'id' | 'full_name' | 'avatar_url' | 'headline' | 'username' | 'resume_url'
  >
}