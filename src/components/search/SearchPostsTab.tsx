import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatRelativeTime, truncate } from '@/lib/utils'
import { ThumbsUpIcon, MessageSquareIcon } from 'lucide-react'

interface Props {
  posts: any[]
  showHeader: boolean
}

export default function SearchPostsTab({ posts, showHeader }: Props) {
  return (
    <div className={showHeader ? 'mt-4 pt-4 border-t border-slate-100' : ''}>
      {showHeader && (
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Posts ({posts.length})
        </h3>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            {/* Author */}
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/u/${post.author?.username}`} className="shrink-0">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                    {getInitials(post.author?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0">
                <Link href={`/u/${post.author?.username}`} className="hover:underline">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {post.author?.full_name ?? 'Unknown'}
                  </p>
                </Link>
                <p className="text-xs text-slate-400">
                  {formatRelativeTime(post.created_at)}
                </p>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {truncate(post.content, 200)}
            </p>

            {/* Post image */}
            {post.image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full max-h-48 object-cover"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <ThumbsUpIcon className="w-3.5 h-3.5" />
                {post.likes_count}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MessageSquareIcon className="w-3.5 h-3.5" />
                {post.comments_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}