export const APP_NAME = 'LinkedIn'
export const APP_DESCRIPTION = 'LinkedIn is the world\'s largest professional network'
export const JOB_TYPES = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
] as const

export const WORK_MODES = [
    { value: 'onsite', label: 'On-site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
] as const

export const APPLICATION_STATUSES = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
    { value: 'selected', label: 'Selected', color: 'bg-green-100 text-green-700' },
] as const

export const SKILLS_LIST = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Java', 'C++', 'Go', 'Rust',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'AWS', 'Docker', 'Kubernetes', 'Git',
    'Machine Learning', 'Data Science', 'UI/UX Design',
    'Product Management', 'Marketing', 'Sales', 'Finance',
] as const

export const INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
    'Manufacturing', 'Consulting', 'Media', 'Real Estate', 'Legal',
    'Government', 'Non-profit', 'Hospitality', 'Automotive', 'Energy',
] as const

export const COMPANY_SIZES = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+',
] as const

export const SUPABASE_STORAGE = {
    AVATARS: 'avatars',
    BANNERS: 'banners',
    POST_IMAGES: 'post-images',
    RESUMES: 'resumes',
    COMPANY_LOGOS: 'company-logos',
} as const

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FEED: '/feed',
    PROFILE: '/profile',
    EDIT_PROFILE: '/profile/edit',
    NETWORK: '/network',
    JOBS: '/jobs',
    APPLICATIONS: '/applications',
    NOTIFICATIONS: '/notifications',
    SETTINGS: '/settings',
    ADMIN: '/admin/dashboard',
    RECRUITER: '/recruiter/dashboard',
} as const