'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { createPostSchema, CreatePostValues } from '@/lib/validations/post'
import { PostWithAuthor } from '@/types/feed'
import { Button } from '@/components/ui/button'
import { Loader2Icon, XIcon } from 'lucide-react'

interface Props {
    post: PostWithAuthor
    onClose: () => void
    onUpdated: (content: string) => void
}

export default function EditPostDialog({ post, onClose, onUpdated }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } =
        useForm<CreatePostValues>({
            resolver: zodResolver(createPostSchema),
            defaultValues: { content: post.content },
        })

    const content = watch('content') ?? ''

    const onSubmit = async (values: CreatePostValues) => {
        if (values.content.trim() === post.content) {
            onClose()
            return
        }

        setIsSubmitting(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('posts')
            .update({
                content: values.content.trim(),
                is_edited: true,
            })
            .eq('id', post.id)

        setIsSubmitting(false)

        if (error) {
            toast.error('Failed to update post')
            return
        }

        onUpdated(values.content.trim())
        toast.success('Post updated')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

                {/* Dialog header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">Edit post</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Dialog body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                    <textarea
                        {...register('content')}
                        rows={6}
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent leading-relaxed"
                    />
                    {errors.content && (
                        <p className="text-xs text-red-500">{errors.content.message}</p>
                    )}

                    <div className="flex items-center justify-between">
                        <span className={`text-xs ${content.length > 2800 ? 'text-red-500' : 'text-slate-400'}`}>
                            {content.length}/3000
                        </span>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="rounded-full font-semibold text-slate-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || !content.trim()}
                                className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full font-semibold px-4"
                            >
                                {isSubmitting ? (
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}