import { Loader2Icon } from 'lucide-react'

interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function PageLoadingSpinner({
  message = 'Loading...',
  size = 'md',
}: Props) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2Icon className={`${iconSize} animate-spin text-[#0a66c2]`} />
      {message && (
        <p className="text-sm text-slate-500">{message}</p>
      )}
    </div>
  )
}