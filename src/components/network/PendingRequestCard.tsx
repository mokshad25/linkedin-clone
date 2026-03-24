'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { UserCheckIcon, UserXIcon, Loader2Icon, MapPinIcon } from 'lucide-react'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  headline: string | null
  username: string | null
  location: string | null
}

interface Connection {
  id: string
  requester_id: string
  receiver_id: string
  status: string
  created_at: string
  updated_at: string
}

interface PendingRequest {
  connection: Connection
  profile: Profile
}

interface Props {
  request: PendingRequest
  onAccepted: (connectionId: string) => void
  onDeclined: (connectionId: string) => void
}

export default function PendingRequestCard({
  request,
  onAccepted,
  onDeclined,
}: Props) {
  const [isActing, setIsActing] = useState(false)

  const handleAccept = async () => {
    setIsActing(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', request.connection.id)

    if (error) {
      toast.error('Failed to accept request')
      setIsActing(false)
      return
    }

    toast.success(`Connected with ${request.profile.full_name ?? 'this person'}!`)
    onAccepted(request.connection.id)
    setIsActing(false)
  }

  const handleDecline = async () => {
    setIsActing(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', request.connection.id)

    if (error) {
      toast.error('Failed to decline request')
      setIsActing(false)
      return
    }

    toast.success('Request declined')
    onDeclined(request.connection.id)
    setIsActing(false)
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
      {/* Avatar */}
      <Link
        href={`/u/${request.profile.username ?? request.profile.id}`}
        className="shrink-0"
      >
        <Avatar className="w-14 h-14">
          <AvatarImage src={request.profile.avatar_url ?? undefined} />
          <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-lg">
            {getInitials(request.profile.full_name)}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/u/${request.profile.username ?? request.profile.id}`}
          className="hover:underline"
        >
          <p className="text-sm font-semibold text-slate-900 leading-tight">
            {request.profile.full_name ?? 'Unknown User'}
          </p>
        </Link>

        {request.profile.headline && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-tight">
            {request.profile.headline}
          </p>
        )}

        {request.profile.location && (
          <div className="flex items-center gap-1 mt-1">
            <MapPinIcon className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">
              {request.profile.location}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleAccept}
            disabled={isActing}
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold"
          >
            {isActing ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserCheckIcon className="w-4 h-4 mr-1" />
                Accept
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            disabled={isActing}
            className="rounded-full border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-500 font-semibold"
          >
            <UserXIcon className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}
