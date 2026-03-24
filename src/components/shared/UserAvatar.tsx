import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
    name: string | null
    avatarUrl?: string | null
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl',
}

export default function UserAvatar({ name, avatarUrl, size = 'md', className }: Props) {
    return (
        <Avatar className={cn(sizeMap[size], className)}>
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    )
}