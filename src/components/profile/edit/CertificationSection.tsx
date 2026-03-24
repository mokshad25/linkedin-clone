'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { certificationSchema, CertificationValues } from '@/lib/validations/profile'
import { Certification } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { PlusIcon, Trash2Icon, Loader2Icon, AwardIcon } from 'lucide-react'

interface Props { userId: string; initialItems: Certification[] }

export default function CertificationSection({ userId, initialItems }: Props) {
    const [items, setItems] = useState<Certification[]>(initialItems)
    const [adding, setAdding] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<CertificationValues>({ resolver: zodResolver(certificationSchema) })

    const onSubmit = async (values: CertificationValues) => {
        setIsSaving(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('certifications')
            .insert({ ...values, user_id: userId })
            .select().single()

        if (error) { toast.error('Failed to add certification'); setIsSaving(false); return }
        setItems([data, ...items])
        reset(); setAdding(false)
        toast.success('Certification added')
        setIsSaving(false)
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const supabase = createClient()
        const { error } = await supabase.from('certifications').delete().eq('id', id)
        if (error) { toast.error('Failed to delete'); setDeletingId(null); return }
        setItems(items.filter((i) => i.id !== id))
        toast.success('Certification removed')
        setDeletingId(null)
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5" id="certifications">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Licenses & Certifications</h2>
                <Button variant="outline" size="sm" onClick={() => setAdding(!adding)}
                    className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50">
                    <PlusIcon className="w-4 h-4 mr-1" />Add
                </Button>
            </div>

            {adding && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs font-medium text-slate-700">Name *</Label>
                            <Input placeholder="AWS Solutions Architect" className="h-9 text-sm border-slate-200" {...register('name')} />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs font-medium text-slate-700">Issuing Organization *</Label>
                            <Input placeholder="Amazon Web Services" className="h-9 text-sm border-slate-200" {...register('issuer')} />
                            {errors.issuer && <p className="text-xs text-red-500">{errors.issuer.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Issue Date</Label>
                            <Input type="date" className="h-9 text-sm border-slate-200" {...register('issue_date')} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Expiry Date</Label>
                            <Input type="date" className="h-9 text-sm border-slate-200" {...register('expiry_date')} />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs font-medium text-slate-700">Credential URL</Label>
                            <Input placeholder="https://verify.com/cert/abc123" className="h-9 text-sm border-slate-200" {...register('credential_url')} />
                            {errors.credential_url && <p className="text-xs text-red-500">{errors.credential_url.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setAdding(false); reset() }}>Cancel</Button>
                        <Button type="submit" size="sm" disabled={isSaving} className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full">
                            {isSaving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {items.length === 0 && !adding && (
                    <p className="text-sm text-slate-400 text-center py-4">No certifications added yet</p>
                )}
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 group">
                        <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            <AwardIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.issuer}</p>
                            {item.issue_date && <p className="text-xs text-slate-400">Issued {formatDate(item.issue_date)}</p>}
                        </div>
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all">
                            {deletingId === item.id ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Trash2Icon className="w-4 h-4" />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
