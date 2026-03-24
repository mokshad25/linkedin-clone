'use client'

import { truncate } from '@/lib/utils'
import { APPLICATION_STATUSES } from '@/lib/constants'
import {
  BarChart2Icon,
  TrendingUpIcon,
  UsersIcon,
  FileTextIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  stats: any
  signupChart: { day: string; count: number }[]
  postsChart: { day: string; count: number }[]
  topPosts: any[]
  applicationStatusCounts: Record<string, number>
}

function BarChart({ data, color, label }: { data: { day: string; count: number }[]; color: string; label: string }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const last30 = data.slice(-30)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2Icon className="w-4 h-4" style={{ color }} />
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <span className="ml-auto text-xs text-slate-400">Last 30 days</span>
      </div>

      <div className="flex items-end gap-0.5 h-20">
        {last30.map((d, i) => {
          const height = Math.max((d.count / max) * 100, 2)
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all cursor-default group relative"
              style={{ height: `${height}%`, backgroundColor: color, opacity: 0.5 + (i / last30.length) * 0.5 }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                <div className="bg-slate-900 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap">
                  {d.count}
                </div>
              </div>
            </div>
          )
        })}
        {last30.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 h-full">
            No data available
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">30 days ago</span>
        <span className="text-xs font-semibold text-slate-700">
          Total: {last30.reduce((sum, d) => sum + d.count, 0)}
        </span>
        <span className="text-xs text-slate-400">Today</span>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon, color, subLabel }: {
  label: string; value: number | string; icon: any; color: string; subLabel?: string
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subLabel && <p className="text-xs text-slate-400 mt-1">{subLabel}</p>}
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

export default function AdminAnalyticsClient({
  stats,
  signupChart,
  postsChart,
  topPosts,
  applicationStatusCounts,
}: Props) {
  const totalApplications = Object.values(applicationStatusCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5 text-[#0a66c2]" />
          Platform Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Growth metrics and platform health
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Users"
          value={stats?.total_users ?? 0}
          icon={UsersIcon}
          color="bg-blue-50 text-blue-600"
          subLabel={`+${stats?.new_users_7d ?? 0} this week`}
        />
        <MetricCard
          label="Total Posts"
          value={stats?.total_posts ?? 0}
          icon={FileTextIcon}
          color="bg-purple-50 text-purple-600"
          subLabel={`+${stats?.new_posts_7d ?? 0} this week`}
        />
        <MetricCard
          label="Total Jobs"
          value={stats?.total_jobs ?? 0}
          icon={BarChart2Icon}
          color="bg-green-50 text-green-600"
          subLabel={`${stats?.active_jobs ?? 0} active`}
        />
        <MetricCard
          label="Applications"
          value={stats?.total_applications ?? 0}
          icon={TrendingUpIcon}
          color="bg-orange-50 text-orange-600"
          subLabel={`+${stats?.new_applications_7d ?? 0} this week`}
        />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        <BarChart data={signupChart} color="#0a66c2" label="Daily New Users" />
        <BarChart data={postsChart} color="#9333ea" label="Daily New Posts" />
      </div>

      {/* Application status breakdown + Top posts */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Application funnel */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Application Status Breakdown
          </h3>
          {totalApplications === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {APPLICATION_STATUSES.map(({ value, label, color }) => {
                const count = applicationStatusCounts[value] ?? 0
                const pct = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0
                return (
                  <div key={value}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
                        {label}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0a66c2] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top posts by engagement */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Top Posts by Engagement
          </h3>
          {topPosts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No posts yet</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, i) => (
                <div key={post.id} className="flex items-start gap-3">
                  <span className="text-lg font-bold text-slate-300 w-6 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/u/${post.author?.username}`}
                      className="text-xs font-semibold text-slate-700 hover:underline"
                    >
                      {post.author?.full_name ?? 'Unknown'}
                    </Link>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      {truncate(post.content, 80)}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ThumbsUpIcon className="w-3 h-3" />
                        {post.likes_count}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageSquareIcon className="w-3 h-3" />
                        {post.comments_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role distribution */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">User Role Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Students', count: stats?.total_students ?? 0, color: 'bg-blue-500', bg: 'bg-blue-50' },
            { label: 'Recruiters', count: stats?.total_recruiters ?? 0, color: 'bg-purple-500', bg: 'bg-purple-50' },
            { label: 'Admins', count: stats?.total_admins ?? 0, color: 'bg-red-500', bg: 'bg-red-50' },
          ].map(({ label, count, color, bg }) => {
            const total = (stats?.total_users ?? 1)
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={label} className={`rounded-lg p-4 ${bg} text-center`}>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{label}</p>
                <div className="h-1.5 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{pct}% of total</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}