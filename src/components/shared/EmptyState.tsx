import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button
            size="sm"
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-5"
          >
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-5"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}