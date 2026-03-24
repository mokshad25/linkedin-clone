'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { createCommentSchema, CreateCommentValues } from '@/lib/validations/post'
import { CommentWithAuthor } from '@/types/feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatRelativeTime } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  postId: string
  currentUserId: string
  onCommentCountChange: (delta: number) => void
}

export default function CommentSection({ postId, currentUserId, onCommentCountChange }: Props) {
  const { profile } = useAuthStore()
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateCommentValues>({
      resolver: zodResolver(createCommentSchema),
    })

  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('post_comments')
        .select(`
          *,
          author:profiles!post_comments_author_id_fkey(
            id, full_name, avatar_url, headline, username
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      const enriched = (data ?? []).map((c) => ({
        ...c,
        is_owner: c.author_id === currentUserId,
      })) as CommentWithAuthor[]

      setComments(enriched)
      setIsLoading(false)
    }

    fetchComments()
  }, [postId, currentUserId])

  const onSubmit = async (values: CreateCommentValues) => {
    setIsSubmitting(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        author_id: currentUserId,
        content: values.content.trim(),
      })
      .select(`
        *,
        author:profiles!post_comments_author_id_fkey(
          id, full_name, avatar_url, headline, username
        )
      `)
      .single()

    if (error || !data) {
      toast.error('Failed to post comment')
      setIsSubmitting(false)
      return
    }

    const newComment: CommentWithAuthor = { ...data, is_owner: true }
    setComments((prev) => [...prev, newComment])
    onCommentCountChange(1)
    reset()
    setIsSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId)
    const supabase = createClient()
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      toast.error('Failed to delete comment')
      setDeletingId(null)
      return
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId))
    onCommentCountChange(-1)
    setDeletingId(null)
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2Icon className="w-4 h-4 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <Link href={`/u/${comment.author.username}`} className="shrink-0">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                    {getInitials(comment.author.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="bg-slate-50 rounded-xl px-3 py-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      href={`/u/${comment.author.username}`}
                      className="text-xs font-semibold text-slate-900 hover:underline"
                    >
                      {comment.author.full_name ?? 'Unknown'}
                    </Link>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  {comment.author.headline && (
                    <p className="text-xs text-slate-500 truncate">
                      {comment.author.headline}
                    </p>
                  )}
                  <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>

              {comment.is_owner && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all shrink-0 self-start mt-1"
                >
                  {deletingId === comment.id
                    ? <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2Icon className="w-3.5 h-3.5" />
                  }
                </button>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-1">
              No comments yet. Be the first!
            </p>
          )}
        </div>
      )}

      {/* Comment input */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-start">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
            {getInitials(profile?.full_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-slate-400 transition-colors">
            <input
              {...register('content')}
              placeholder="Add a comment..."
              className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(onSubmit)()
                }
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-[#0a66c2] hover:text-[#004182] disabled:opacity-40 shrink-0"
            >
              {isSubmitting
                ? <Loader2Icon className="w-4 h-4 animate-spin" />
                : <Loader2Icon className="w-4 h-4 opacity-0" />
              }
            </button>
          </div>
          {errors.content && (
            <p className="text-xs text-red-500 mt-1 px-1">{errors.content.message}</p>
          )}
          <p className="text-xs text-slate-400 mt-1 px-1">
            Press Enter to post
          </p>
        </div>
      </form>
    </div>
  )
}