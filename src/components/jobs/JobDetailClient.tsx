'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { JobWithCompany } from '@/types/jobs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatSalary, formatDate, formatRelativeTime } from '@/lib/utils'
import { APPLICATION_STATUSES, JOB_TYPES, WORK_MODES } from '@/lib/constants'
import {
  MapPinIcon,
  BookmarkIcon,
  BuildingIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  ExternalLinkIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  Loader2Icon,
} from 'lucide-react'

interface Props {
  job: JobWithCompany & { company: any }
  existingApplication: any
  currentUserId: string
  userResumeUrl: string | null
}

export default function JobDetailClient({
  job: initialJob,
  existingApplication,
  currentUserId,
  userResumeUrl,
}: Props) {
  const [job, setJob] = useState(initialJob)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasApplied, setHasApplied] = useState(!!existingApplication)
  const [applicationStatus, setApplicationStatus] = useState(
    existingApplication?.status ?? null
  )

  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.type)?.label ?? job.type
  const workModeLabel = WORK_MODES.find((m) => m.value === job.work_mode)?.label ?? job.work_mode
  const statusConfig = APPLICATION_STATUSES.find((s) => s.value === applicationStatus)

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    if (job.is_saved) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', job.id)
        .eq('user_id', currentUserId)
      setJob((prev) => ({ ...prev, is_saved: false }))
      toast.success('Removed from saved jobs')
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ job_id: job.id, user_id: currentUserId })
      setJob((prev) => ({ ...prev, is_saved: true }))
      toast.success('Job saved!')
    }
    setIsSaving(false)
  }

  const handleApply = async () => {
    setIsApplying(true)
    const supabase = createClient()

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      applicant_id: currentUserId,
      cover_letter: coverLetter.trim() || null,
      resume_url: userResumeUrl,
      status: 'applied',
    })

    setIsApplying(false)

    if (error) {
      toast.error('Failed to submit application')
      return
    }

    setHasApplied(true)
    setApplicationStatus('applied')
    setShowApplyForm(false)
    toast.success('Application submitted successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">

      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to jobs
      </Link>

      <div className="flex gap-4 items-start">

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Job header card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-start gap-4">

              {/* Company logo */}
              <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <BuildingIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              {/* Job info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
                <p className="text-base text-slate-700 mt-0.5">{job.company.name}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  {job.location && (
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPinIcon className="w-4 h-4" />
                      {job.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <BriefcaseIcon className="w-4 h-4" />
                    {jobTypeLabel}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <ClockIcon className="w-4 h-4" />
                    {workModeLabel}
                  </span>
                </div>

                {(job.salary_min || job.salary_max) && (
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {formatSalary(job.salary_min, job.salary_max)} / year
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-3.5 h-3.5" />
                    {job.applications_count} applicants
                  </span>
                  <span>{formatRelativeTime(job.created_at)}</span>
                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      Apply by {formatDate(job.deadline, 'dd MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              {hasApplied ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusConfig?.color ?? 'bg-green-100 text-green-700'}`}>
                    {statusConfig?.label ?? 'Applied'}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => setShowApplyForm(!showApplyForm)}
                  className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-6"
                >
                  Easy Apply
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className={`rounded-full font-semibold border-[#0a66c2] ${job.is_saved ? 'bg-blue-50 text-[#0a66c2]' : 'text-[#0a66c2]'}`}
              >
                <BookmarkIcon className={`w-4 h-4 mr-1.5 ${job.is_saved ? 'fill-[#0a66c2]' : ''}`} />
                {job.is_saved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Apply form */}
            {showApplyForm && !hasApplied && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Submit your application
                </h3>

                {userResumeUrl ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                    <CheckCircle2Icon className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Your resume will be attached automatically.</span>
                    <a
                      href={userResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0a66c2] hover:underline text-xs ml-auto shrink-0"
                    >
                      Preview
                    </a>
                  </div>
                ) : (
                  <div className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
                    No resume uploaded.{' '}
                    <Link href="/profile/edit" className="underline font-medium">
                      Upload your resume
                    </Link>{' '}
                    to improve your application.
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Cover letter{' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the recruiter why you are a great fit..."
                    rows={4}
                    className="border-slate-200 resize-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold"
                  >
                    {isApplying ? (
                      <>
                        <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit application'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowApplyForm(false)}
                    className="text-slate-600 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                Skills required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(({ skill }: any) => (
                  <Badge
                    key={skill.id}
                    className="bg-[#eef3f8] text-[#0a66c2] border-0 font-medium"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              About the role
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                Requirements
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: company info */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-3 sticky top-16">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              About the company
            </h3>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <BuildingIcon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {job.company.name}
                </p>
                {job.company.industry && (
                  <p className="text-xs text-slate-500">{job.company.industry}</p>
                )}
              </div>
            </div>

            {job.company.description && (
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 mb-3">
                {job.company.description}
              </p>
            )}

            <div className="space-y-1.5">
              {job.company.size && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <UsersIcon className="w-3.5 h-3.5" />
                  {job.company.size} employees
                </div>
              )}
              {job.company.location && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {job.company.location}
                </div>
              )}
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#0a66c2] hover:underline"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                  Visit website
                </a>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}