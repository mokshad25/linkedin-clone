'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  BarChart2Icon,
  ShieldIcon,
} from 'lucide-react'

const LINKS = [
  { href: '/admin/dashboard',  icon: LayoutDashboardIcon, label: 'Dashboard' },
  { href: '/admin/users',      icon: UsersIcon,           label: 'Users' },
  { href: '/admin/companies',  icon: BuildingIcon,        label: 'Companies' },
  { href: '/admin/moderation', icon: ShieldIcon,          label: 'Moderation' },
  { href: '/admin/analytics',  icon: BarChart2Icon,       label: 'Analytics' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-red-100 flex items-center justify-center">
            <ShieldIcon className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-sm font-bold text-slate-900">Admin Panel</span>
        </div>
      </div>

      <nav className="py-1">
        {LINKS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#eef3f8] text-[#0a66c2] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}