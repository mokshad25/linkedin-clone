'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PostWithAuthor } from '@/types/feed'

const PAGE_SIZE = 10

export function useFeed(currentUserId: string | undefined) {
    const [posts, setPosts] = useState<PostWithAuthor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)

    const fetchPosts = useCallback(async (pageNum: number, replace = false) => {
        if (!currentUserId) return
        const supabase = createClient()

        const from = pageNum * PAGE_SIZE
        const to = from + PAGE_SIZE - 1

        const { data, error } = await supabase
            .from('posts')
            .select(`
        *,
        author:profiles!posts_author_id_fkey(
          id, full_name, avatar_url, headline, username
        )
      `)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error || !data) return

        // Check likes for current user
        const postIds = data.map((p) => p.id)
        const { data: likes } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', currentUserId)
            .in('post_id', postIds)

        const likedSet = new Set((likes ?? []).map((l) => l.post_id))

        const enriched: PostWithAuthor[] = data.map((post) => ({
            ...post,
            is_liked: likedSet.has(post.id),
            is_owner: post.author_id === currentUserId,
        }))

        if (replace) {
            setPosts(enriched)
        } else {
            setPosts((prev) => [...prev, ...enriched])
        }

        setHasMore(data.length === PAGE_SIZE)
    }, [currentUserId])

    useEffect(() => {
        setIsLoading(true)
        fetchPosts(0, true).finally(() => setIsLoading(false))
    }, [fetchPosts])

    const loadMore = async () => {
        setIsLoadingMore(true)
        const nextPage = page + 1
        setPage(nextPage)
        await fetchPosts(nextPage)
        setIsLoadingMore(false)
    }

    const addPost = (post: PostWithAuthor) => {
        setPosts((prev) => [post, ...prev])
    }

    const updatePost = (id: string, updates: Partial<PostWithAuthor>) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        )
    }

    const removePost = (id: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== id))
    }

    return {
        posts,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
        addPost,
        updatePost,
        removePost,
    }
}