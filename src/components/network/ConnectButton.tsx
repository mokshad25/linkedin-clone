'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useConnectionState } from '@/hooks/useConnections'
import {
    UserPlusIcon,
    UserCheckIcon,
    UserXIcon,
    ClockIcon,
    Loader2Icon,
} from 'lucide-react'

interface Props {
    currentUserId: string
    targetUserId: string
    size?: 'sm' | 'default'
    variant?: 'default' | 'outline'
}

export default function ConnectButton({
    currentUserId,
    targetUserId,
    size = 'sm',
    variant = 'default',
}: Props) {
    const { status, connectionId, isLoading, setState } = useConnectionState(
        currentUserId,
        targetUserId
    )
    const [isActing, setIsActing] = useState(false)

    if (currentUserId === targetUserId) return null

    const sendRequest = async () => {
        setIsActing(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('connections')
            .insert({ requester_id: currentUserId, receiver_id: targetUserId, status: 'pending' })
            .select()
            .single()

        if (error) {
            toast.error('Failed to send request')
            setIsActing(false)
            return
        }

        setState({ status: 'pending_sent', connectionId: data.id })
        toast.success('Connection request sent!')
        setIsActing(false)
    }

    const withdrawRequest = async () => {
        if (!connectionId) return
        setIsActing(true)
        const supabase = createClient()
        await supabase.from('connections').delete().eq('id', connectionId)
        setState({ status: 'none', connectionId: null })
        toast.success('Request withdrawn')
        setIsActing(false)
    }

    const acceptRequest = async () => {
        if (!connectionId) return
        setIsActing(true)
        const supabase = createClient()
        await supabase
            .from('connections')
            .update({ status: 'accepted' })
            .eq('id', connectionId)

        setState({ status: 'accepted', connectionId })
        toast.success('Connection accepted!')
        setIsActing(false)
    }

    const rejectRequest = async () => {
        if (!connectionId) return
        setIsActing(true)
        const supabase = createClient()
        await supabase.from('connections').delete().eq('id', connectionId)
        setState({ status: 'none', connectionId: null })
        toast.success('Request declined')
        setIsActing(false)
    }

    const removeConnection = async () => {
        if (!connectionId) return
        if (!confirm('Remove this connection?')) return
        setIsActing(true)
        const supabase = createClient()
        await supabase.from('connections').delete().eq('id', connectionId)
        setState({ status: 'none', connectionId: null })
        toast.success('Connection removed')
        setIsActing(false)
    }

    if (isLoading) {
        return (
            <Button size={size} variant="outline" disabled className="rounded-full">
                <Loader2Icon className="w-4 h-4 animate-spin" />
            </Button>
        )
    }

    if (status === 'none') {
        return (
            <Button
                size={size}
                onClick={sendRequest}
                disabled={isActing}
                className={`rounded-full font-semibold ${variant === 'default'
                        ? 'bg-[#0a66c2] hover:bg-[#004182] text-white'
                        : 'border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50'
                    }`}
                variant={variant === 'outline' ? 'outline' : 'default'}
            >
                {isActing
                    ? <Loader2Icon className="w-4 h-4 animate-spin" />
                    : <><UserPlusIcon className="w-4 h-4 mr-1.5" />Connect</>
                }
            </Button>
        )
    }

    if (status === 'pending_sent') {
        return (
            <Button
                size={size}
                variant="outline"
                onClick={withdrawRequest}
                disabled={isActing}
                className="rounded-full font-semibold border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-500"
            >
                {isActing
                    ? <Loader2Icon className="w-4 h-4 animate-spin" />
                    : <><ClockIcon className="w-4 h-4 mr-1.5" />Pending</>
                }
            </Button>
        )
    }

    if (status === 'pending_received') {
        return (
            <div className="flex items-center gap-2">
                <Button
                    size={size}
                    onClick={acceptRequest}
                    disabled={isActing}
                    className="rounded-full font-semibold bg-[#0a66c2] hover:bg-[#004182] text-white"
                >
                    {isActing
                        ? <Loader2Icon className="w-4 h-4 animate-spin" />
                        : <><UserCheckIcon className="w-4 h-4 mr-1.5" />Accept</>
                    }
                </Button>
                <Button
                    size={size}
                    variant="outline"
                    onClick={rejectRequest}
                    disabled={isActing}
                    className="rounded-full font-semibold border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-500"
                >
                    <UserXIcon className="w-4 h-4 mr-1.5" />
                    Decline
                </Button>
            </div>
        )
    }

    if (status === 'accepted') {
        return (
            <Button
                size={size}
                variant="outline"
                onClick={removeConnection}
                disabled={isActing}
                className="rounded-full font-semibold border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-500"
            >
                {isActing
                    ? <Loader2Icon className="w-4 h-4 animate-spin" />
                    : <><UserCheckIcon className="w-4 h-4 mr-1.5" />Connected</>
                }
            </Button>
        )
    }

    return null
}