'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export default function NotificationBell() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const isActive = pathname === '/notifications'

  useEffect(() => {
    if (!user) return

    const supabase = createClient()

    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      setUnreadCount(count ?? 0)
    }

    fetchCount()

    // Realtime subscription for new notifications
    const channel = supabase
      .channel('notifications_count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Reset count when visiting notifications page
  useEffect(() => {
    if (pathname === '/notifications') {
      setUnreadCount(0)
    }
  }, [pathname])

  return (
    <Link
      href="/notifications"
      className={`relative flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 min-w-[56px] border-b-2 transition-colors text-xs font-medium ${
        isActive
          ? 'border-slate-900 text-slate-900'
          : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-400'
      }`}
    >
      <div className="relative">
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <span className="hidden sm:block">Notifications</span>
    </Link>
  )
}