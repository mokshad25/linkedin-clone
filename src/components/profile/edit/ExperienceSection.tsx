'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { experienceSchema, ExperienceValues } from '@/lib/validations/profile'
import { Experience } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'
import { PlusIcon, Trash2Icon, Loader2Icon, BriefcaseIcon } from 'lucide-react'

interface Props {
    userId: string
    initialItems: Experience[]
}

export default function ExperienceSection({ userId, initialItems }: Props) {
    const [items, setItems] = useState<Experience[]>(initialItems)
    const [adding, setAdding] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, reset, watch, formState: { errors } } =
        useForm<ExperienceValues>({ resolver: zodResolver(experienceSchema) })

    const isCurrent = watch('is_current')

    const onSubmit = async (values: ExperienceValues) => {
        setIsSaving(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('experience')
            .insert({ ...values, user_id: userId })
            .select()
            .single()

        if (error) { toast.error('Failed to add experience'); setIsSaving(false); return }

        setItems([data, ...items])
        reset()
        setAdding(false)
        toast.success('Experience added')
        setIsSaving(false)
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const supabase = createClient()
        const { error } = await supabase.from('experience').delete().eq('id', id)
        if (error) { toast.error('Failed to delete'); setDeletingId(null); return }
        setItems(items.filter((i) => i.id !== id))
        toast.success('Experience removed')
        setDeletingId(null)
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5" id="experience">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Experience</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdding(!adding)}
                    className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50"
                >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add
                </Button>
            </div>

            {/* Add form */}
            {adding && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Job Title *</Label>
                            <Input placeholder="Software Engineer" className="h-9 text-sm border-slate-200" {...register('title')} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Company *</Label>
                            <Input placeholder="Google" className="h-9 text-sm border-slate-200" {...register('company')} />
                            {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Location</Label>
                            <Input placeholder="Bangalore, India" className="h-9 text-sm border-slate-200" {...register('location')} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Start Date</Label>
                            <Input type="date" className="h-9 text-sm border-slate-200" {...register('start_date')} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <input type="checkbox" id="exp_current" className="accent-[#0a66c2]" {...register('is_current')} />
                                <Label htmlFor="exp_current" className="text-xs text-slate-600 cursor-pointer">Currently working here</Label>
                            </div>
                            {!isCurrent && (
                                <Input type="date" className="h-9 text-sm border-slate-200" {...register('end_date')} />
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-700">Description</Label>
                        <Textarea placeholder="Describe your role..." rows={3} className="text-sm border-slate-200 resize-none" {...register('description')} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setAdding(false); reset() }}>Cancel</Button>
                        <Button type="submit" size="sm" disabled={isSaving} className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full">
                            {isSaving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </form>
            )}

            {/* List */}
            <div className="space-y-4">
                {items.length === 0 && !adding && (
                    <p className="text-sm text-slate-400 text-center py-4">No experience added yet</p>
                )}
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 group">
                        <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            <BriefcaseIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-600">{item.company}</p>
                            <p className="text-xs text-slate-400">
                                {item.start_date ? formatDate(item.start_date) : ''}{' – '}
                                {item.is_current ? 'Present' : item.end_date ? formatDate(item.end_date) : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all"
                        >
                            {deletingId === item.id
                                ? <Loader2Icon className="w-4 h-4 animate-spin" />
                                : <Trash2Icon className="w-4 h-4" />
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}