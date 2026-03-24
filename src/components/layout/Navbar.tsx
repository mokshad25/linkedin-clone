'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NotificationBell from './NotificationBell'
import { toast } from 'sonner'
import {
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  SearchIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  BuildingIcon,
  LayoutDashboardIcon,
} from 'lucide-react'

// BellIcon is intentionally excluded here — NotificationBell handles it
const NAV_ITEMS = [
  { href: '/feed',    icon: HomeIcon,      label: 'Home' },
  { href: '/network', icon: UsersIcon,     label: 'My Network' },
  { href: '/jobs',    icon: BriefcaseIcon, label: 'Jobs' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, role } = useAuthStore()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-14">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 h-full flex items-center justify-between gap-2">

        {/* Logo + Search */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/feed" className="shrink-0">
            <div className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-extrabold text-lg leading-none">in</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center bg-[#eef3f8] rounded-md px-3 h-8 gap-2 w-48">
            <SearchIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-500 outline-none w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) router.push(`/search?q=${encodeURIComponent(val)}`)
                }
              }}
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-stretch h-full">

          {/* Main nav items — Home, My Network, Jobs */}
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 min-w-[56px] border-b-2 transition-colors text-xs font-medium ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            )
          })}

          {/* Notification bell — handles its own active state and badge */}
          <NotificationBell />

          {/* Recruiter nav item */}
          {role === 'recruiter' && (
            <Link
              href="/recruiter/dashboard"
              className={`flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 min-w-[56px] border-b-2 transition-colors text-xs font-medium ${
                pathname.startsWith('/recruiter')
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-400'
              }`}
            >
              <BuildingIcon className="w-5 h-5" />
              <span className="hidden sm:block">Recruiter</span>
            </Link>
          )}

          {/* Admin nav item */}
          {role === 'admin' && (
            <Link
              href="/admin/dashboard"
              className={`flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 min-w-[56px] border-b-2 transition-colors text-xs font-medium ${
                pathname.startsWith('/admin')
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-400'
              }`}
            >
              <LayoutDashboardIcon className="w-5 h-5" />
              <span className="hidden sm:block">Admin</span>
            </Link>
          )}

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col items-center justify-center gap-0.5 px-3 sm:px-4 min-w-[56px] border-b-2 border-transparent text-slate-500 hover:text-slate-900 outline-none cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                  {getInitials(profile?.full_name ?? 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:flex items-center gap-0.5 text-xs font-medium">
                Me <ChevronDownIcon className="w-3 h-3" />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 mt-1">
              {/* Profile preview */}
              <div className="px-3 py-3 flex items-center gap-3 border-b border-slate-100">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    {getInitials(profile?.full_name ?? 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {profile?.full_name ?? 'Your Name'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {profile?.headline ?? 'Add a headline'}
                  </p>
                </div>
              </div>

              <div className="py-1">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                    <SettingsIcon className="w-4 h-4 text-slate-500" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="py-1">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
      </div>
    </header>
  )
}