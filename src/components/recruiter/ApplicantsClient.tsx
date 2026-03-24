'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { APPLICATION_STATUSES } from '@/lib/constants'
import {
  MapPinIcon,
  FileTextIcon,
  ArrowLeftIcon,
  UsersIcon,
} from 'lucide-react'

interface Props {
  job: any
  applications: any[]
}

export default function ApplicantsClient({
  job,
  applications: initialApps,
}: Props) {
  const [applications, setApplications] = useState(initialApps)
  const [filter, setFilter] = useState<string>('all')

  const updateStatus = async (appId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId)

    if (error) {
      toast.error('Failed to update status')
      return
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    )
    toast.success('Status updated')
  }

  const filtered =
    filter === 'all'
      ? applications
      : applications.filter((a) => a.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <Link
          href="/recruiter/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to dashboard
        </Link>
        <h1 className="text-lg font-bold text-slate-900">{job.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {applications.length} total applicant
          {applications.length !== 1 ? 's' : ''}
        </p>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          {APPLICATION_STATUSES.map(({ value, label, color }) => {
            const count = applications.filter((a) => a.status === value).length
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === value
                    ? `ring-2 ring-offset-1 ring-slate-400 ${color}`
                    : `${color} opacity-70 hover:opacity-100`
                }`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Applicants list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center">
          <UsersIcon className="w-10 h-10 text-slate-300" />
          <p className="font-semibold text-slate-600">
            No applicants in this category
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const statusConfig = APPLICATION_STATUSES.find(
              (s) => s.value === app.status
            )
            return (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start gap-3">

                  {/* Avatar */}
                  <Link
                    href={`/u/${app.applicant?.username ?? app.applicant?.id}`}
                    className="shrink-0"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={app.applicant?.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                        {getInitials(app.applicant?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/u/${app.applicant?.username ?? app.applicant?.id}`}
                          className="hover:underline"
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {app.applicant?.full_name ?? 'Unknown'}
                          </p>
                        </Link>
                        {app.applicant?.headline && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.applicant.headline}
                          </p>
                        )}
                        {app.applicant?.location && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPinIcon className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {app.applicant.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status dropdown */}
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a66c2] ${
                          statusConfig?.color ?? 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {APPLICATION_STATUSES.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cover letter */}
                    {app.cover_letter && (
                      <div className="mt-2 p-2.5 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {app.cover_letter}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        Applied {formatRelativeTime(app.created_at)}
                      </span>

                      {app.applicant?.resume_url && (
                        <a
                          href={app.applicant.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#0a66c2] hover:underline font-medium"
                        >
                          <FileTextIcon className="w-3.5 h-3.5" />
                          View Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}