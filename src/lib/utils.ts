import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(
  date: string | Date | null | undefined,
  pattern = 'MMM yyyy'
): string {
  if (!date) return ''
  try {
    return format(new Date(date), pattern)
  } catch {
    return ''
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateProfileCompletion(profile: Partial<{
  full_name: string | null
  headline: string | null
  about: string | null
  avatar_url: string | null
  location: string | null
  resume_url: string | null
}>): number {
  const fields = [
    profile.full_name,
    profile.headline,
    profile.about,
    profile.avatar_url,
    profile.location,
    profile.resume_url,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export function formatSalary(
  min: number | null,
  max: number | null
): string {
  if (!min && !max) return 'Salary not disclosed'
  if (!max) return `₹${(min! / 100000).toFixed(1)}L+`
  if (!min) return `Up to ₹${(max / 100000).toFixed(1)}L`
  return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? `${count} ${word}` : `${count} ${word}s`
}