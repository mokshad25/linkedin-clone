import { z } from 'zod'

export const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    headline: z.string().max(220, 'Headline too long').optional().or(z.literal('')),
    about: z.string().max(2600, 'About section too long').optional().or(z.literal('')),
    location: z.string().max(100).optional().or(z.literal('')),
    website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    github_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    twitter_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    phone: z.string().max(20).optional().or(z.literal('')),
    is_open_to_work: z.boolean().default(false),
})

export const educationSchema = z.object({
    school: z.string().min(1, 'School name is required').max(200),
    degree: z.string().max(100).optional().or(z.literal('')),
    field_of_study: z.string().max(100).optional().or(z.literal('')),
    start_date: z.string().optional().or(z.literal('')),
    end_date: z.string().optional().or(z.literal('')),
    is_current: z.boolean().default(false),
    description: z.string().max(1000).optional().or(z.literal('')),
})

export const experienceSchema = z.object({
    company: z.string().min(1, 'Company name is required').max(200),
    title: z.string().min(1, 'Job title is required').max(200),
    location: z.string().max(100).optional().or(z.literal('')),
    start_date: z.string().optional().or(z.literal('')),
    end_date: z.string().optional().or(z.literal('')),
    is_current: z.boolean().default(false),
    description: z.string().max(2000).optional().or(z.literal('')),
})

export const certificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required').max(200),
    issuer: z.string().min(1, 'Issuer is required').max(200),
    issue_date: z.string().optional().or(z.literal('')),
    expiry_date: z.string().optional().or(z.literal('')),
    credential_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export const projectSchema = z.object({
    title: z.string().min(1, 'Project title is required').max(200),
    description: z.string().max(2000).optional().or(z.literal('')),
    url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    start_date: z.string().optional().or(z.literal('')),
    end_date: z.string().optional().or(z.literal('')),
})

export type ProfileValues = z.infer<typeof profileSchema>
export type EducationValues = z.infer<typeof educationSchema>
export type ExperienceValues = z.infer<typeof experienceSchema>
export type CertificationValues = z.infer<typeof certificationSchema>
export type ProjectValues = z.infer<typeof projectSchema>