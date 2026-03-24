import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { getInitials } from '@/lib/utils'
import { Profile } from '@/types/database'
import { BookmarkIcon, UsersIcon } from 'lucide-react'

interface Props {
    profile: Profile | null
}

export default function LeftSidebar({ profile }: Props) {
    return (
        <div className="space-y-2">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Banner */}
                <div className="h-14 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                    {profile?.banner_url && (
                        <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Avatar */}
                <div className="px-3 pb-3">
                    <div className="-mt-7 mb-2">
                        <Avatar className="w-14 h-14 border-2 border-white ring-1 ring-slate-200">
                            <AvatarImage src={profile?.avatar_url ?? undefined} />
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-lg font-semibold">
                                {getInitials(profile?.full_name ?? 'U')}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <Link href="/profile">
                        <h2 className="font-semibold text-slate-900 text-sm hover:underline leading-tight">
                            {profile?.full_name ?? 'Your Name'}
                        </h2>
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight line-clamp-2">
                        {profile?.headline ?? 'Add a headline to your profile'}
                    </p>

                    {/* Profile completion */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-500">Profile completion</span>
                            <span className="text-xs font-semibold text-[#0a66c2]">
                                {profile?.profile_completion ?? 0}%
                            </span>
                        </div>
                        <Progress
                            value={profile?.profile_completion ?? 0}
                            className="h-1.5 bg-slate-100"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-slate-200 py-2">
                <Link
                    href="/network"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <UsersIcon className="w-4 h-4 text-slate-500" />
                    <span>My Network</span>
                </Link>
                <Link
                    href="/jobs/saved"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <BookmarkIcon className="w-4 h-4 text-slate-500" />
                    <span>Saved Jobs</span>
                </Link>
            </div>
        </div>
    )
}