'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { BuildingIcon, Trash2Icon, Loader2Icon, CheckCircle2Icon, XCircleIcon } from 'lucide-react'

interface Props {
  companies: any[]
}

export default function AdminCompaniesClient({ companies: initial }: Props) {
  const [companies, setCompanies] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = async (companyId: string, name: string) => {
    if (!confirm(`Delete company "${name}"? This will also delete all associated jobs.`)) return
    setDeletingId(companyId)
    const supabase = createClient()
    const { error } = await supabase.from('companies').delete().eq('id', companyId)
    if (error) { toast.error('Failed to delete'); setDeletingId(null); return }
    setCompanies((prev) => prev.filter((c) => c.id !== companyId))
    toast.success(`${name} deleted`)
    setDeletingId(null)
  }

  const toggleVerified = async (companyId: string, current: boolean) => {
    setTogglingId(companyId)
    const supabase = createClient()
    const { error } = await supabase
      .from('companies')
      .update({ is_verified: !current })
      .eq('id', companyId)

    if (error) { toast.error('Failed to update'); setTogglingId(null); return }
    setCompanies((prev) =>
      prev.map((c) => c.id === companyId ? { ...c, is_verified: !current } : c)
    )
    toast.success(current ? 'Verification removed' : 'Company verified!')
    setTogglingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900">Company Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {companies.length} registered compan{companies.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Company', 'Owner', 'Industry', 'Jobs', 'Created', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No companies yet
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                          {c.logo_url
                            ? <img src={c.logo_url} className="w-full h-full object-contain p-0.5" />
                            : <BuildingIcon className="w-4 h-4 text-slate-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                          {c.location && (
                            <p className="text-xs text-slate-400 truncate">{c.location}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {c.owner?.full_name ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500">{c.industry ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900">
                        {c.jobs_count?.[0]?.count ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {formatDate(c.created_at, 'dd MMM yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={c.is_verified
                        ? 'bg-green-100 text-green-700 text-xs'
                        : 'bg-slate-100 text-slate-500 text-xs'
                      }>
                        {c.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVerified(c.id, c.is_verified)}
                          disabled={togglingId === c.id}
                          className={`h-8 w-8 p-0 ${c.is_verified ? 'text-green-600 hover:text-slate-500' : 'text-slate-400 hover:text-green-600'}`}
                          title={c.is_verified ? 'Remove verification' : 'Verify company'}
                        >
                          {togglingId === c.id
                            ? <Loader2Icon className="w-4 h-4 animate-spin" />
                            : c.is_verified
                              ? <CheckCircle2Icon className="w-4 h-4" />
                              : <XCircleIcon className="w-4 h-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c.id, c.name)}
                          disabled={deletingId === c.id}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                        >
                          {deletingId === c.id
                            ? <Loader2Icon className="w-4 h-4 animate-spin" />
                            : <Trash2Icon className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}