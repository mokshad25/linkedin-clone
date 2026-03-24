'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { createPostSchema, CreatePostValues } from '@/lib/validations/post'
import { Profile } from '@/types/database'
import { PostWithAuthor } from '@/types/feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import {
    ImageIcon,
    VideoIcon,
    FileTextIcon,
    XIcon,
    Loader2Icon,
    GlobeIcon,
} from 'lucide-react'

interface Props {
    currentUserId: string
    currentUserProfile: Profile | null
    onPostCreated: (post: PostWithAuthor) => void
}

export default function CreatePost({
    currentUserId,
    currentUserProfile,
    onPostCreated,
}: Props) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreatePostValues>({
        resolver: zodResolver(createPostSchema),
    })

    const content = watch('content') ?? ''

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    const uploadPostImage = async (file: File, postId: string): Promise<string | null> => {
        const supabase = createClient()
        const ext = file.name.split('.').pop()
        const path = `${currentUserId}/${postId}.${ext}`

        const { error } = await supabase.storage
            .from('post-images')
            .upload(path, file, { upsert: true, contentType: file.type })

        if (error) return null

        const { data } = supabase.storage.from('post-images').getPublicUrl(path)
        return data.publicUrl
    }

    const onSubmit = async (values: CreatePostValues) => {
        setIsSubmitting(true)
        const supabase = createClient()

        // Insert post first (without image)
        const { data: post, error } = await supabase
            .from('posts')
            .insert({
                author_id: currentUserId,
                content: values.content.trim(),
            })
            .select()
            .single()

        if (error || !post) {
            toast.error('Failed to create post')
            setIsSubmitting(false)
            return
        }

        // Upload image if attached
        let imageUrl: string | null = null
        if (imageFile) {
            setUploadingImage(true)
            imageUrl = await uploadPostImage(imageFile, post.id)
            setUploadingImage(false)

            if (imageUrl) {
                await supabase
                    .from('posts')
                    .update({ image_url: imageUrl })
                    .eq('id', post.id)
            }
        }

        const newPost: PostWithAuthor = {
            ...post,
            image_url: imageUrl,
            author: {
                id: currentUserId,
                full_name: currentUserProfile?.full_name ?? null,
                avatar_url: currentUserProfile?.avatar_url ?? null,
                headline: currentUserProfile?.headline ?? null,
                username: currentUserProfile?.username ?? null,
            },
            is_liked: false,
            is_owner: true,
        }

        onPostCreated(newPost)
        reset()
        removeImage()
        setIsExpanded(false)
        toast.success('Post shared!')
        setIsSubmitting(false)
    }

    const handleCancel = () => {
        reset()
        removeImage()
        setIsExpanded(false)
    }

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
            {/* Top row — avatar + trigger */}
            <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={currentUserProfile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold text-sm">
                        {getInitials(currentUserProfile?.full_name)}
                    </AvatarFallback>
                </Avatar>

                {!isExpanded && (
                    <button
                        onClick={() => {
                            setIsExpanded(true)
                            setTimeout(() => textareaRef.current?.focus(), 50)
                        }}
                        className="flex-1 h-10 rounded-full border border-slate-300 px-4 text-sm text-slate-500 text-left hover:bg-slate-50 transition-colors"
                    >
                        Start a post...
                    </button>
                )}
            </div>

            {/* Expanded compose area */}
            {isExpanded && (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
                    {/* Audience */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-1">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={currentUserProfile?.avatar_url ?? undefined} />
                            <AvatarFallback className="text-xs bg-slate-200">
                                {getInitials(currentUserProfile?.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <span>{currentUserProfile?.full_name ?? 'You'}</span>
                        <div className="flex items-center gap-0.5 ml-1 px-2 py-0.5 border border-slate-300 rounded-full cursor-pointer hover:bg-slate-50">
                            <GlobeIcon className="w-3 h-3" />
                            <span>Anyone</span>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className="relative">
                        <textarea
                            {...register('content')}
                            ref={(e) => {
                                register('content').ref(e)
                                    ; (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = e
                            }}
                            placeholder="What do you want to talk about?"
                            rows={4}
                            onInput={autoResize}
                            className="w-full resize-none text-sm text-slate-800 placeholder:text-slate-400 outline-none leading-relaxed min-h-[100px] px-1"
                        />
                        {errors.content && (
                            <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                        )}
                    </div>

                    {/* Character count */}
                    <div className="flex justify-end">
                        <span className={`text-xs ${content.length > 2800 ? 'text-red-500' : 'text-slate-400'}`}>
                            {content.length}/3000
                        </span>
                    </div>

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-80 object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 w-7 h-7 bg-slate-900/70 hover:bg-slate-900 rounded-full flex items-center justify-center transition-colors"
                            >
                                <XIcon className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    )}

                    {/* Toolbar + actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-0.5">
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                            >
                                <ImageIcon className="w-4 h-4 text-blue-500" />
                                <span className="hidden sm:block">Photo</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                            >
                                <VideoIcon className="w-4 h-4 text-green-500" />
                                <span className="hidden sm:block">Video</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                            >
                                <FileTextIcon className="w-4 h-4 text-orange-500" />
                                <span className="hidden sm:block">Article</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="text-slate-600 font-semibold rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || !content.trim()}
                                className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full px-4 disabled:opacity-40"
                            >
                                {isSubmitting ? (
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Post'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            )}

            {/* Bottom toolbar — collapsed state */}
            {!isExpanded && (
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                    >
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        Media
                    </button>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                    >
                        <VideoIcon className="w-4 h-4 text-green-500" />
                        Video
                    </button>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
                    >
                        <FileTextIcon className="w-4 h-4 text-orange-500" />
                        Write article
                    </button>
                </div>
            )}
        </div>
    )
}