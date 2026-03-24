'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  SearchIcon,
  Trash2Icon,
  Loader2Icon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldIcon,
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  users: any[]
  total: number
  page: number
  pageSize: number
  filters: { q?: string; role?: string }
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  recruiter: 'bg-purple-100 text-purple-700',
  student: 'bg-blue-100 text-blue-700',
}

export default function AdminUsersClient({ users, total, page, pageSize, filters }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(filters.q ?? '')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / pageSize)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    params.set('page', '1')
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return
    setDeletingId(userId)
    const supabase = createClient()

    const { error } = await supabase.auth.admin
      ? await supabase.from('profiles').delete().eq('id', userId)
      : { error: new Error('Not permitted') }

    if (error) {
      toast.error('Failed to delete user')
      setDeletingId(null)
      return
    }

    toast.success(`User ${userName} deleted`)
    router.refresh()
    setDeletingId(null)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    params.set('page', newPage.toString())
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {total} total user{total !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="pl-9 h-9 w-56 border-slate-200"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide hidden md:table-cell">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide hidden sm:table-cell">
                  Joined
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const role = u.role?.role ?? 'student'
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={u.avatar_url ?? undefined} />
                            <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                              {getInitials(u.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link
                              href={`/u/${u.username}`}
                              className="text-sm font-medium text-slate-900 hover:text-[#0a66c2] hover:underline truncate block"
                            >
                              {u.full_name ?? 'No name'}
                            </Link>
                            <p className="text-xs text-slate-400 truncate">
                              @{u.username ?? u.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge className={`text-xs font-semibold ${ROLE_COLORS[role] ?? 'bg-slate-100 text-slate-600'}`}>
                          {role}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-slate-500">
                          {u.location ?? '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-slate-500">
                          {formatDate(u.created_at, 'dd MMM yyyy')}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/u/${u.username}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-[#0a66c2]"
                            >
                              <UserIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(u.id, u.full_name ?? 'this user')}
                            disabled={deletingId === u.id}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                          >
                            {deletingId === u.id
                              ? <Loader2Icon className="w-4 h-4 animate-spin" />
                              : <Trash2Icon className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(page - 1)}
                disabled={page <= 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1
                return (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changePage(p)}
                    className={`h-8 w-8 p-0 text-xs ${page === p ? 'bg-[#0a66c2] text-white' : ''}`}
                  >
                    {p}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}