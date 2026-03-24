'use client'

import Link from 'next/link'
import { formatRelativeTime, getInitials, truncate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  UsersIcon,
  BriefcaseIcon,
  FileTextIcon,
  BuildingIcon,
  TrendingUpIcon,
  ActivityIcon,
  UserCheckIcon,
  BarChart2Icon,
} from 'lucide-react'

interface Props {
  stats: any
  signupChart: { day: string; count: number }[]
  postsChart: { day: string; count: number }[]
  recentUsers: any[]
  recentPosts: any[]
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  href,
}: {
  label: string
  value: number | string
  sub?: string
  icon: any
  color: string
  href?: string
}) {
  const inner = (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )

  if (href) return <Link href={href}>{inner}</Link>
  return inner
}

// Mini bar chart using pure CSS/SVG
function MiniBarChart({
  data,
  color,
}: {
  data: { day: string; count: number }[]
  color: string
}) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const last14 = data.slice(-14)

  return (
    <div className="flex items-end gap-0.5 h-12">
      {last14.map((d, i) => {
        const height = Math.max((d.count / max) * 100, 4)
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all"
            style={{ height: `${height}%`, backgroundColor: color, opacity: 0.75 + (i / last14.length) * 0.25 }}
            title={`${d.day}: ${d.count}`}
          />
        )
      })}
      {last14.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          No data
        </div>
      )}
    </div>
  )
}

export default function AdminDashboardClient({
  stats,
  signupChart,
  postsChart,
  recentUsers,
  recentPosts,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Platform overview and management
        </p>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Users"
          value={stats?.total_users ?? 0}
          sub={`+${stats?.new_users_7d ?? 0} this week`}
          icon={UsersIcon}
          color="bg-blue-50 text-blue-600"
          href="/admin/users"
        />
        <StatCard
          label="Total Posts"
          value={stats?.total_posts ?? 0}
          sub={`+${stats?.new_posts_7d ?? 0} this week`}
          icon={FileTextIcon}
          color="bg-purple-50 text-purple-600"
          href="/admin/moderation"
        />
        <StatCard
          label="Active Jobs"
          value={stats?.active_jobs ?? 0}
          sub={`${stats?.total_jobs ?? 0} total`}
          icon={BriefcaseIcon}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Companies"
          value={stats?.total_companies ?? 0}
          icon={BuildingIcon}
          color="bg-orange-50 text-orange-600"
          href="/admin/companies"
        />
      </div>

      {/* Secondary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Students"
          value={stats?.total_students ?? 0}
          icon={UserCheckIcon}
          color="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          label="Recruiters"
          value={stats?.total_recruiters ?? 0}
          icon={UsersIcon}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Applications"
          value={stats?.total_applications ?? 0}
          sub={`+${stats?.new_applications_7d ?? 0} this week`}
          icon={TrendingUpIcon}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Connections"
          value={stats?.total_connections ?? 0}
          icon={ActivityIcon}
          color="bg-pink-50 text-pink-600"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2Icon className="w-4 h-4 text-[#0a66c2]" />
            <h3 className="text-sm font-semibold text-slate-900">
              New Signups (last 14 days)
            </h3>
          </div>
          <MiniBarChart data={signupChart} color="#0a66c2" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">14 days ago</span>
            <span className="text-xs text-slate-400">Today</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2Icon className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              New Posts (last 14 days)
            </h3>
          </div>
          <MiniBarChart data={postsChart} color="#9333ea" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">14 days ago</span>
            <span className="text-xs text-slate-400">Today</span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Recent users */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Recent Users</h3>
            <Link
              href="/admin/users"
              className="text-xs text-[#0a66c2] hover:underline font-medium"
            >
              Manage all
            </Link>
          </div>
          <div className="space-y-2">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No users yet</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={u.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                      {getInitials(u.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {u.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatRelativeTime(u.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent posts */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Recent Posts</h3>
            <Link
              href="/admin/moderation"
              className="text-xs text-[#0a66c2] hover:underline font-medium"
            >
              Moderate
            </Link>
          </div>
          <div className="space-y-2">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No posts yet</p>
            ) : (
              recentPosts.map((post: any) => (
                <div key={post.id} className="p-2 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarImage src={post.author?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs bg-slate-200">
                        {getInitials(post.author?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {post.author?.full_name ?? 'Unknown'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto shrink-0">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {truncate(post.content, 100)}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">
                      {post.likes_count} likes
                    </span>
                    <span className="text-xs text-slate-400">
                      {post.comments_count} comments
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}