'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import {
  BellIcon,
  UserPlusIcon,
  UserCheckIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  InfoIcon,
} from 'lucide-react'

interface Notification {
  id: string
  type: string
  message: string
  is_read: boolean
  created_at: string
  resource_id: string | null
  resource_type: string | null
  actor: {
    id: string
    full_name: string | null
    avatar_url: string | null
    username: string | null
    headline: string | null
  } | null
}

interface Props {
  notifications: Notification[]
  currentUserId: string
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  connection_request: { icon: UserPlusIcon, color: 'bg-blue-100 text-blue-600', label: 'Connection Request' },
  connection_accepted: { icon: UserCheckIcon, color: 'bg-green-100 text-green-600', label: 'Connected' },
  post_like: { icon: ThumbsUpIcon, color: 'bg-blue-100 text-blue-600', label: 'Liked your post' },
  post_comment: { icon: MessageSquareIcon, color: 'bg-purple-100 text-purple-600', label: 'Commented' },
  job_application: { icon: BriefcaseIcon, color: 'bg-orange-100 text-orange-600', label: 'Application' },
  application_status_change: { icon: TrendingUpIcon, color: 'bg-yellow-100 text-yellow-600', label: 'Status Update' },
  job_recommendation: { icon: BriefcaseIcon, color: 'bg-blue-100 text-blue-600', label: 'Job for you' },
  general: { icon: InfoIcon, color: 'bg-slate-100 text-slate-600', label: 'Notification' },
}

function getNotificationLink(notification: Notification): string {
  if (!notification.resource_id) return '#'
  switch (notification.resource_type) {
    case 'connection': return '/network'
    case 'post': return '/feed'
    case 'application': return '/applications'
    case 'job': return `/jobs/${notification.resource_id}`
    default: return '#'
  }
}

export default function NotificationsClient({ notifications }: Props) {
  const [items, setItems] = useState<Notification[]>(notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = items.filter((n) => !n.is_read).length
  const filtered = filter === 'unread' ? items.filter((n) => !n.is_read) : items

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-3">

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-[#0a66c2]" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <BellIcon className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-sm text-slate-500 max-w-xs">
              {filter === 'unread'
                ? 'You are all caught up!'
                : 'When you get notifications, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((notification) => {
              const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.general
              const Icon = config.icon
              const href = getNotificationLink(notification)

              return (
                <Link key={notification.id} href={href}>
                  <div
                    className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Actor avatar or icon */}
                    {notification.actor ? (
                      <div className="relative shrink-0">
                        <Avatar className="w-11 h-11">
                          <AvatarImage src={notification.actor.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                            {getInitials(notification.actor.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${config.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 leading-snug">
                        {notification.actor && (
                          <span className="font-semibold">
                            {notification.actor.full_name ?? 'Someone'}{' '}
                          </span>
                        )}
                        {notification.message}
                      </p>
                      {notification.actor?.headline && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {notification.actor.headline}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.is_read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0a66c2] shrink-0 mt-1.5" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}