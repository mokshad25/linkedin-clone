'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { MapPinIcon, UserPlusIcon, ClockIcon, UserCheckIcon, Loader2Icon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PersonResult {
  id: string
  full_name: string | null
  avatar_url: string | null
  headline: string | null
  location: string | null
  username: string | null
  connectionStatus: string
  connectionId: string | null
}

interface ConnState {
  status: string
  id: string | null
}

interface Props {
  people: PersonResult[]
  currentUserId: string
  showHeader: boolean
  query: string
}

export default function SearchPeopleTab({ people, currentUserId, showHeader, query }: Props) {
  const initialStates: Record<string, ConnState> = {}
  people.forEach((p) => {
    initialStates[p.id] = { status: p.connectionStatus, id: p.connectionId }
  })

  const [connectionStates, setConnectionStates] = useState<Record<string, ConnState>>(initialStates)
  const [acting, setActing] = useState<string | null>(null)

  const sendRequest = async (targetId: string) => {
    setActing(targetId)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: currentUserId,
        receiver_id: targetId,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to send request')
      setActing(null)
      return
    }

    setConnectionStates((prev) => ({
      ...prev,
      [targetId]: { status: 'pending_sent', id: data.id },
    }))
    toast.success('Connection request sent!')
    setActing(null)
  }

  const withdrawRequest = async (targetId: string, connId: string) => {
    setActing(targetId)
    const supabase = createClient()

    await supabase.from('connections').delete().eq('id', connId)

    setConnectionStates((prev) => ({
      ...prev,
      [targetId]: { status: 'none', id: null },
    }))
    toast.success('Request withdrawn')
    setActing(null)
  }

  const displayPeople = showHeader ? people.slice(0, 3) : people

  return (
    <div className="space-y-1">
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            People ({people.length})
          </h3>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=people`}
            className="text-xs text-[#0a66c2] hover:underline font-medium"
          >
            See all people
          </Link>
        </div>
      )}

      {displayPeople.map((person) => {
        const conn = connectionStates[person.id]
        const isActing = acting === person.id

        return (
          <div
            key={person.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            {/* Avatar */}
            <Link href={`/u/${person.username ?? person.id}`} className="shrink-0">
              <Avatar className="w-12 h-12">
                <AvatarImage src={person.avatar_url ?? undefined} />
                <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                  {getInitials(person.full_name)}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/u/${person.username ?? person.id}`} className="hover:underline">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {person.full_name ?? 'Unknown User'}
                </p>
              </Link>
              {person.headline && (
                <p className="text-xs text-slate-500 truncate">{person.headline}</p>
              )}
              {person.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPinIcon className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{person.location}</span>
                </div>
              )}
            </div>

            {/* Connection button */}
            <div className="shrink-0">
              {conn?.status === 'none' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendRequest(person.id)}
                  disabled={isActing}
                  className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 font-semibold text-xs"
                >
                  {isActing ? (
                    <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <UserPlusIcon className="w-3.5 h-3.5 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              )}

              {conn?.status === 'pending_sent' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => conn.id && withdrawRequest(person.id, conn.id)}
                  disabled={isActing}
                  className="rounded-full border-slate-300 text-slate-500 hover:border-red-400 hover:text-red-500 font-semibold text-xs"
                >
                  {isActing ? (
                    <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <ClockIcon className="w-3.5 h-3.5 mr-1" />
                      Pending
                    </>
                  )}
                </Button>
              )}

              {conn?.status === 'pending_received' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 px-2">
                  <UserPlusIcon className="w-3.5 h-3.5" />
                  Respond
                </span>
              )}

              {conn?.status === 'accepted' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 px-2">
                  <UserCheckIcon className="w-3.5 h-3.5" />
                  Connected
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}