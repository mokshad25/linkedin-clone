'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getInitials, formatRelativeTime, truncate } from '@/lib/utils'
import {
  Trash2Icon,
  Loader2Icon,
  ShieldIcon,
  ThumbsUpIcon,
  MessageSquareIcon,
  ImageIcon,
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  posts: any[]
}

export default function AdminModerationClient({ posts: initial }: Props) {
  const [posts, setPosts] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'image' | 'text'>('all')

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post? This action cannot be undone.')) return
    setDeletingId(postId)
    const supabase = createClient()
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) { toast.error('Failed to delete post'); setDeletingId(null); return }
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    toast.success('Post deleted')
    setDeletingId(null)
  }

  const filtered = posts.filter((p) => {
    if (filter === 'image') return !!p.image_url
    if (filter === 'text') return !p.image_url
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-red-500" />
              Content Moderation
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {posts.length} post{posts.length !== 1 ? 's' : ''} to review
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            {(['all', 'text', 'image'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3">
          <ShieldIcon className="w-10 h-10 text-slate-300" />
          <p className="font-semibold text-slate-600">No posts to moderate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Author */}
                <Link href={`/u/${post.author?.username}`} className="shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author?.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                      {getInitials(post.author?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/u/${post.author?.username}`} className="hover:underline">
                        <span className="text-sm font-semibold text-slate-900">
                          {post.author?.full_name ?? 'Unknown'}
                        </span>
                      </Link>
                      <span className="text-xs text-slate-400">
                        {formatRelativeTime(post.created_at)}
                      </span>
                      {post.image_url && (
                        <Badge className="bg-blue-100 text-blue-600 text-xs border-0 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Has image
                        </Badge>
                      )}
                      {post.is_edited && (
                        <Badge className="bg-slate-100 text-slate-500 text-xs border-0">
                          Edited
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="shrink-0 text-slate-400 hover:text-red-500 h-8 w-8 p-0"
                    >
                      {deletingId === post.id
                        ? <Loader2Icon className="w-4 h-4 animate-spin" />
                        : <Trash2Icon className="w-4 h-4" />
                      }
                    </Button>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {truncate(post.content, 300)}
                  </p>

                  {/* Image preview */}
                  {post.image_url && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 w-48">
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="w-full object-cover max-h-32"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <ThumbsUpIcon className="w-3.5 h-3.5" />
                      {post.likes_count} likes
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <MessageSquareIcon className="w-3.5 h-3.5" />
                      {post.comments_count} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}