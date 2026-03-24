'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { projectSchema, ProjectValues } from '@/lib/validations/profile'
import { Project } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusIcon, Trash2Icon, Loader2Icon, FolderIcon } from 'lucide-react'

interface Props { userId: string; initialItems: Project[] }

export default function ProjectSection({ userId, initialItems }: Props) {
    const [items, setItems] = useState<Project[]>(initialItems)
    const [adding, setAdding] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<ProjectValues>({ resolver: zodResolver(projectSchema) })

    const onSubmit = async (values: ProjectValues) => {
        setIsSaving(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('projects')
            .insert({ ...values, user_id: userId })
            .select().single()

        if (error) { toast.error('Failed to add project'); setIsSaving(false); return }
        setItems([data, ...items])
        reset(); setAdding(false)
        toast.success('Project added')
        setIsSaving(false)
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        const supabase = createClient()
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) { toast.error('Failed to delete'); setDeletingId(null); return }
        setItems(items.filter((i) => i.id !== id))
        toast.success('Project removed')
        setDeletingId(null)
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5" id="projects">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Projects</h2>
                <Button variant="outline" size="sm" onClick={() => setAdding(!adding)}
                    className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50">
                    <PlusIcon className="w-4 h-4 mr-1" />Add
                </Button>
            </div>

            {adding && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs font-medium text-slate-700">Project Title *</Label>
                            <Input placeholder="My Awesome Project" className="h-9 text-sm border-slate-200" {...register('title')} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs font-medium text-slate-700">Project URL</Label>
                            <Input placeholder="https://github.com/you/project" className="h-9 text-sm border-slate-200" {...register('url')} />
                            {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">Start Date</Label>
                            <Input type="date" className="h-9 text-sm border-slate-200" {...register('start_date')} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-700">End Date</Label>
                            <Input type="date" className="h-9 text-sm border-slate-200" {...register('end_date')} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-700">Description</Label>
                        <Textarea placeholder="What did you build and how?" rows={3} className="text-sm border-slate-200 resize-none" {...register('description')} />
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
                    <p className="text-sm text-slate-400 text-center py-4">No projects added yet</p>
                )}
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 group">
                        <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            <FolderIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0a66c2] hover:underline">{item.url}</a>}
                            {item.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>}
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