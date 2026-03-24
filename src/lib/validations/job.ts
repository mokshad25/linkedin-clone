import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  founded_year: z.coerce.number().min(1800).max(new Date().getFullYear()).optional().nullable(),
})

export const jobSchema = z.object({
  title: z.string().min(2, 'Job title is required').max(200),
  description: z.string().min(20, 'Please provide a detailed description').max(5000),
  requirements: z.string().max(3000).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'freelance']),
  work_mode: z.enum(['onsite', 'remote', 'hybrid']),
  salary_min: z.coerce.number().min(0).optional().nullable(),
  salary_max: z.coerce.number().min(0).optional().nullable(),
  experience_required: z.string().max(100).optional().or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

export const applicationSchema = z.object({
  cover_letter: z.string().max(2000).optional().or(z.literal('')),
})

export type CompanyValues = z.infer<typeof companySchema>
export type JobValues = z.infer<typeof jobSchema>
export type ApplicationValues = z.infer<typeof applicationSchema>