'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { PostWithAuthor } from '@/types/feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import CommentSection from './CommentSection'
import EditPostDialog from './EditPostDialog'
import {
    ThumbsUpIcon,
    MessageSquareIcon,
    ShareIcon,
    SendIcon,
    MoreHorizontalIcon,
    PencilIcon,
    Trash2Icon,
    GlobeIcon,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
    post: PostWithAuthor
    currentUserId: string
    onUpdate: (id: string, updates: Partial<PostWithAuthor>) => void
    onDelete: (id: string) => void
}

export default function PostCard({ post, currentUserId, onUpdate, onDelete }: Props) {
    const [showComments, setShowComments] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const CONTENT_LIMIT = 280
    const isLong = post.content.length > CONTENT_LIMIT
    const displayContent = isLong && !isExpanded
        ? post.content.slice(0, CONTENT_LIMIT) + '...'
        : post.content

    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)
        const supabase = createClient()

        if (post.is_liked) {
            await supabase
                .from('post_likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', currentUserId)

            onUpdate(post.id, {
                is_liked: false,
                likes_count: Math.max(0, post.likes_count - 1),
            })
        } else {
            await supabase
                .from('post_likes')
                .insert({ post_id: post.id, user_id: currentUserId })

            onUpdate(post.id, {
                is_liked: true,
                likes_count: post.likes_count + 1,
            })
        }
        setIsLiking(false)
    }

    const handleDelete = async () => {
        if (!confirm('Delete this post?')) return
        setIsDeleting(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', post.id)

        if (error) {
            toast.error('Failed to delete post')
            setIsDeleting(false)
            return
        }

        onDelete(post.id)
        toast.success('Post deleted')
    }

    return (
        <>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">

                {/* Post header */}
                <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                        <Link href={`/u/${post.author.username}`} className="shrink-0">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={post.author.avatar_url ?? undefined} />
                                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                                    {getInitials(post.author.full_name)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="min-w-0 flex-1">
                            <Link
                                href={`/u/${post.author.username}`}
                                className="text-sm font-semibold text-slate-900 hover:underline leading-tight block truncate"
                            >
                                {post.author.full_name ?? 'Unknown User'}
                            </Link>
                            {post.author.headline && (
                                <p className="text-xs text-slate-500 leading-tight truncate">
                                    {post.author.headline}
                                </p>
                            )}
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-xs text-slate-400">
                                    {formatRelativeTime(post.created_at)}
                                </span>
                                {post.is_edited && (
                                    <span className="text-xs text-slate-400">· Edited</span>
                                )}
                                <span className="text-slate-300">·</span>
                                <GlobeIcon className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* 3-dot menu for owner */}
                    {post.is_owner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-slate-100 text-slate-500 shrink-0">
                                    <MoreHorizontalIcon className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setShowEditDialog(true)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Edit post
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                    Delete post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Post content */}
                <div className="px-4 pt-3">
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {displayContent}
                    </p>
                    {isLong && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 mt-1"
                        >
                            {isExpanded ? 'Show less' : 'See more'}
                        </button>
                    )}
                </div>

                {/* Post image */}
                {post.image_url && (
                    <div className="mt-3">
                        <img
                            src={post.image_url}
                            alt="Post image"
                            className="w-full object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Reaction counts */}
                {(post.likes_count > 0 || post.comments_count > 0) && (
                    <div className="px-4 pt-2 pb-1 flex items-center justify-between">
                        {post.likes_count > 0 && (
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0a66c2] hover:underline"
                            >
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#0a66c2] text-white">
                                    <ThumbsUpIcon className="w-2.5 h-2.5 fill-white" />
                                </span>
                                {post.likes_count}
                            </button>
                        )}
                        {post.comments_count > 0 && (
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="text-xs text-slate-500 hover:text-slate-700 hover:underline ml-auto"
                            >
                                {post.comments_count}{' '}
                                {post.comments_count === 1 ? 'comment' : 'comments'}
                            </button>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="px-3 py-1 border-t border-slate-100 flex items-center">
                    {[
                        {
                            icon: ThumbsUpIcon,
                            label: 'Like',
                            active: post.is_liked,
                            onClick: handleLike,
                        },
                        {
                            icon: MessageSquareIcon,
                            label: 'Comment',
                            active: false,
                            onClick: () => setShowComments(!showComments),
                        },
                        {
                            icon: ShareIcon,
                            label: 'Repost',
                            active: false,
                            onClick: () => toast.info('Repost coming soon'),
                        },
                        {
                            icon: SendIcon,
                            label: 'Send',
                            active: false,
                            onClick: () => toast.info('Send coming soon'),
                        },
                    ].map(({ icon: Icon, label, active, onClick }) => (
                        <button
                            key={label}
                            onClick={onClick}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-semibold transition-colors hover:bg-slate-100 ${active
                                    ? 'text-[#0a66c2]'
                                    : 'text-slate-600'
                                }`}
                        >
                            <Icon
                                className={`w-4 h-4 ${active ? 'fill-[#0a66c2] text-[#0a66c2]' : ''}`}
                            />
                            <span className="hidden sm:block">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Comments section */}
                {showComments && (
                    <div className="border-t border-slate-100">
                        <CommentSection
                            postId={post.id}
                            currentUserId={currentUserId}
                            onCommentCountChange={(delta) =>
                                onUpdate(post.id, {
                                    comments_count: Math.max(0, post.comments_count + delta),
                                })
                            }
                        />
                    </div>
                )}
            </div>

            {/* Edit dialog */}
            {showEditDialog && (
                <EditPostDialog
                    post={post}
                    onClose={() => setShowEditDialog(false)}
                    onUpdated={(content) =>
                        onUpdate(post.id, { content, is_edited: true })
                    }
                />
            )}
        </>
    )
}