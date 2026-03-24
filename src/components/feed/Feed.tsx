'use client'

import { useRef, useCallback } from 'react'
import { useFeed } from '@/hooks/useFeed'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import FeedSkeleton from './FeedSkeleton'
import { Profile } from '@/types/database'
import { PostWithAuthor } from '@/types/feed'
import { Loader2Icon, NewspaperIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    currentUserId: string
    currentUserProfile: Profile | null
}

export default function Feed({ currentUserId, currentUserProfile }: Props) {
    const {
        posts,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
        addPost,
        updatePost,
        removePost,
    } = useFeed(currentUserId)

    const observerRef = useRef<IntersectionObserver | null>(null)

    // Infinite scroll sentinel
    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoadingMore) return
            if (observerRef.current) observerRef.current.disconnect()
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore()
                }
            })
            if (node) observerRef.current.observe(node)
        },
        [isLoadingMore, hasMore, loadMore]
    )

    return (
        <div className="space-y-3">
            {/* Create Post */}
            <CreatePost
                currentUserId={currentUserId}
                currentUserProfile={currentUserProfile}
                onPostCreated={addPost}
            />

            {/* Sort bar */}
            <div className="flex items-center gap-2 px-1">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                    Sort by:{' '}
                    <span className="font-semibold text-slate-700 cursor-pointer hover:underline">
                        Top
                    </span>
                </span>
            </div>

            {/* Loading skeleton */}
            {isLoading && <FeedSkeleton />}

            {/* Posts */}
            {!isLoading && posts.length === 0 && (
                <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <NewspaperIcon className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700">No posts yet</p>
                    <p className="text-sm text-slate-500 max-w-xs">
                        Be the first to share something with your network.
                    </p>
                </div>
            )}

            {!isLoading &&
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={currentUserId}
                        onUpdate={updatePost}
                        onDelete={removePost}
                    />
                ))}

            {/* Infinite scroll sentinel */}
            {!isLoading && hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    {isLoadingMore && (
                        <Loader2Icon className="w-5 h-5 animate-spin text-slate-400" />
                    )}
                </div>
            )}

            {!isLoading && !hasMore && posts.length > 0 && (
                <p className="text-center text-xs text-slate-400 py-4">
                    You have seen all posts
                </p>
            )}
        </div>
    )
}