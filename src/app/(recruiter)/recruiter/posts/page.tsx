import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime, truncate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlusIcon, ThumbsUpIcon, MessageSquareIcon } from 'lucide-react'

export const metadata = { title: 'My Posts | LinkedIn' }

export default async function RecruiterPostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">My Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {posts?.length ?? 0} post{posts?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/feed">
          <Button
            size="sm"
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Create post
          </Button>
        </Link>
      </div>

      {/* Posts list */}
      {!posts || posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center gap-3 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <MessageSquareIcon className="w-7 h-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700">No posts yet</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Share updates, job postings, and insights with your network.
          </p>
          <Link href="/feed">
            <Button
              size="sm"
              className="mt-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
            >
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {truncate(post.content, 300)}
              </p>

              {post.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="w-full max-h-48 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ThumbsUpIcon className="w-3.5 h-3.5" />
                    {post.likes_count} likes
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MessageSquareIcon className="w-3.5 h-3.5" />
                    {post.comments_count} comments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {post.is_edited && (
                    <span className="text-xs text-slate-400">Edited</span>
                  )}
                  <span className="text-xs text-slate-400">
                    {formatRelativeTime(post.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}