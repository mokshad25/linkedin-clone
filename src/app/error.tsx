'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangleIcon } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangleIcon className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          An unexpected error occurred. Please try again.
          {error.digest && (
            <span className="block mt-1 text-xs text-slate-400 font-mono">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/feed'}
            className="rounded-full border-slate-300 text-slate-600"
          >
            Go home
          </Button>
          <Button
            onClick={reset}
            className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}