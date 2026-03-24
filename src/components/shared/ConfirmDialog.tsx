'use client'

import { Button } from '@/components/ui/button'
import { Loader2Icon, AlertTriangleIcon } from 'lucide-react'

interface Props {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          {isDestructive && (
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-full text-slate-600"
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-full font-semibold ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#0a66c2] hover:bg-[#004182] text-white'
            }`}
          >
            {isLoading
              ? <Loader2Icon className="w-4 h-4 animate-spin" />
              : confirmLabel
            }
          </Button>
        </div>
      </div>
    </div>
  )
}