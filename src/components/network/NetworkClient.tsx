'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { MapPinIcon, UsersIcon, UserPlusIcon } from 'lucide-react'
import PendingRequestCard from './PendingRequestCard'
import PersonCard from './PersonCard'
import ConnectButton from './ConnectButton'
import { ProfileWithConnection } from '@/types/network'

interface Props {
    currentUserId: string
    pendingRequests: any[]
    connections: any[]
    suggested: any[]
}

export default function NetworkClient({
    currentUserId,
    pendingRequests: initialPending,
    connections: initialConnections,
    suggested,
}: Props) {
    const [pending, setPending] = useState(initialPending)
    const [connections, setConnections] = useState(initialConnections)
    const [tab, setTab] = useState<'requests' | 'connections' | 'suggested'>('requests')

    const handleAccepted = (connectionId: string) => {
        const accepted = pending.find((r) => r.id === connectionId)
        if (accepted) {
            setConnections((prev) => [accepted, ...prev])
        }
        setPending((prev) => prev.filter((r) => r.id !== connectionId))
    }

    const handleDeclined = (connectionId: string) => {
        setPending((prev) => prev.filter((r) => r.id !== connectionId))
    }

    const handleRemoveConnection = (connectionId: string) => {
        setConnections((prev) => prev.filter((c) => c.id !== connectionId))
    }

    const TABS = [
        { key: 'requests', label: 'Invitations', count: pending.length },
        { key: 'connections', label: 'Connections', count: connections.length },
        { key: 'suggested', label: 'People you may know', count: null },
    ] as const

    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
            <div className="flex gap-4 items-start">

                {/* Left panel */}
                <div className="flex-1 min-w-0 space-y-4">

                    {/* Header */}
                    <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                        <h1 className="text-lg font-bold text-slate-900">My Network</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {connections.length} connection{connections.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-100">
                            {TABS.map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className={`flex-1 sm:flex-none px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === key
                                            ? 'border-slate-900 text-slate-900'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {label}
                                    {count !== null && count > 0 && (
                                        <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab: Pending requests */}
                        {tab === 'requests' && (
                            <div className="p-4">
                                {pending.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 gap-3 text-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                            <UserPlusIcon className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <p className="font-semibold text-slate-700">No pending invitations</p>
                                        <p className="text-sm text-slate-500 max-w-xs">
                                            When someone sends you a connection request it will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pending.map((req) => (
                                            <PendingRequestCard
                                                key={req.id}
                                                request={{
                                                    connection: req,
                                                    profile: req.profile,
                                                }}
                                                onAccepted={handleAccepted}
                                                onDeclined={handleDeclined}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: My connections */}
                        {tab === 'connections' && (
                            <div className="p-4">
                                {connections.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 gap-3 text-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                            <UsersIcon className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <p className="font-semibold text-slate-700">No connections yet</p>
                                        <p className="text-sm text-slate-500 max-w-xs">
                                            Grow your network by connecting with people you know.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {connections.map((conn) => {
                                            const person =
                                                conn.requester_id === currentUserId
                                                    ? conn.receiver
                                                    : conn.requester
                                            if (!person) return null
                                            return (
                                                <div
                                                    key={conn.id}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                                                >
                                                    <Link href={`/u/${person.username}`} className="shrink-0">
                                                        <Avatar className="w-12 h-12">
                                                            <AvatarImage src={person.avatar_url ?? undefined} />
                                                            <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                                                                {getInitials(person.full_name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </Link>

                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/u/${person.username}`} className="hover:underline">
                                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                                {person.full_name ?? 'Unknown'}
                                                            </p>
                                                        </Link>
                                                        {person.headline && (
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {person.headline}
                                                            </p>
                                                        )}
                                                        {person.location && (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <MapPinIcon className="w-3 h-3 text-slate-400" />
                                                                <span className="text-xs text-slate-400">{person.location}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ConnectButton
                                                            currentUserId={currentUserId}
                                                            targetUserId={person.id}
                                                            size="sm"
                                                            variant="outline"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Suggested people */}
                        {tab === 'suggested' && (
                            <div className="p-4">
                                {suggested.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 gap-3 text-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                            <UsersIcon className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <p className="font-semibold text-slate-700">No suggestions yet</p>
                                        <p className="text-sm text-slate-500">Check back after more people join.</p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {suggested.map((person) => (
                                            <PersonCard
                                                key={person.id}
                                                person={{
                                                    ...person,
                                                    connection: { status: 'none', connectionId: null },
                                                }}
                                                currentUserId={currentUserId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel — summary */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-3 sticky top-16">
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">
                            Network at a glance
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Connections', value: connections.length },
                                { label: 'Pending invitations', value: pending.length },
                                { label: 'Suggestions', value: suggested.length },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                                >
                                    <span className="text-xs text-slate-600">{label}</span>
                                    <span className="text-sm font-bold text-slate-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-semibold text-slate-700">Grow your network</span>
                            {' '}— People in your network are more likely to see your posts and profile.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}