import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { MapPinIcon } from 'lucide-react'
import ConnectButton from './ConnectButton'
import { ProfileWithConnection } from '@/types/network'

interface Props {
    person: ProfileWithConnection
    currentUserId: string
}

export default function PersonCard({ person, currentUserId }: Props) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
            {/* Top banner */}
            <div className="h-12 bg-gradient-to-r from-blue-100 to-blue-200" />

            <div className="px-4 pb-4 flex flex-col items-center text-center -mt-6 flex-1">
                <Link href={`/u/${person.username}`}>
                    <Avatar className="w-14 h-14 border-2 border-white ring-1 ring-slate-200 mb-2">
                        <AvatarImage src={person.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                            {getInitials(person.full_name)}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                <Link href={`/u/${person.username}`} className="hover:underline">
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                        {person.full_name ?? 'Unknown User'}
                    </h3>
                </Link>

                {person.headline && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                        {person.headline}
                    </p>
                )}

                {person.location && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{person.location}</span>
                    </div>
                )}

                {person.mutual_count !== undefined && person.mutual_count > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                        {person.mutual_count} mutual connection
                        {person.mutual_count > 1 ? 's' : ''}
                    </p>
                )}

                <div className="mt-3">
                    <ConnectButton
                        currentUserId={currentUserId}
                        targetUserId={person.id}
                        variant="outline"
                    />
                </div>
            </div>
        </div>
    )
}