import { Profile, Connection } from './database'

export type ConnectionStatus =
    | 'none'
    | 'pending_sent'
    | 'pending_received'
    | 'accepted'

export interface ConnectionState {
    status: ConnectionStatus
    connectionId: string | null
}

export interface ProfileWithConnection extends Pick
  Profile,
    'id' | 'full_name' | 'avatar_url' | 'headline' | 'location' | 'username'
        > {
        connection: ConnectionState
  mutual_count?: number
    }

export interface PendingRequest {
    connection: Connection
    profile: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'headline' | 'username' | 'location'>
}