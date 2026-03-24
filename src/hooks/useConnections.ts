'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ConnectionState, ConnectionStatus } from '@/types/network'

export function useConnectionState(
    currentUserId: string | undefined,
    targetUserId: string | undefined
) {
    const [state, setState] = useState<ConnectionState>({
        status: 'none',
        connectionId: null,
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
            setIsLoading(false)
            return
        }

        const fetch = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('connections')
                .select('id, status, requester_id, receiver_id')
                .or(
                    `and(requester_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),` +
                    `and(requester_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`
                )
                .maybeSingle()

            if (!data) {
                setState({ status: 'none', connectionId: null })
            } else if (data.status === 'accepted') {
                setState({ status: 'accepted', connectionId: data.id })
            } else if (data.status === 'pending') {
                if (data.requester_id === currentUserId) {
                    setState({ status: 'pending_sent', connectionId: data.id })
                } else {
                    setState({ status: 'pending_received', connectionId: data.id })
                }
            } else {
                setState({ status: 'none', connectionId: null })
            }

            setIsLoading(false)
        }

        fetch()
    }, [currentUserId, targetUserId])

    return { ...state, isLoading, setState }
}