'use client'

import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { ImageIcon, CalendarIcon, FileTextIcon } from 'lucide-react'
import Link from 'next/link'

export default function FeedPlaceholder() {
    const { profile } = useAuthStore()

    return (
        <div className="space-y-3">
            {/* Create Post Box */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                    <Link href="/profile">
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={profile?.avatar_url ?? undefined} />
                            <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold">
                                {getInitials(profile?.full_name ?? 'U')}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <button className="flex-1 h-10 rounded-full border border-slate-300 px-4 text-sm text-slate-500 text-left hover:bg-slate-50 transition-colors">
                        Start a post, try writing with AI
                    </button>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        Media
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold">
                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                        Event
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold">
                        <FileTextIcon className="w-4 h-4 text-red-500" />
                        Write article
                    </button>
                </div>
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between px-1">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="px-3 text-xs text-slate-500 whitespace-nowrap">
                    Sort by: <span className="font-semibold text-slate-700">Top</span>
                </span>
            </div>

            {/* Posts coming in Phase 4 */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 bg-slate-200 rounded w-32" />
                            <div className="h-2.5 bg-slate-200 rounded w-48" />
                            <div className="h-2.5 bg-slate-200 rounded w-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                        <div className="h-3 bg-slate-200 rounded w-4/6" />
                    </div>
                </div>
            ))}
        </div>
    )
}