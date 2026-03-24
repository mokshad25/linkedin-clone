import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-[#0a66c2] rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-extrabold text-2xl">in</span>
        </div>
        <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-3">Page not found</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/feed">
            <Button className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-6">
              Back to feed
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" className="rounded-full border-[#0a66c2] text-[#0a66c2] font-semibold">
              Browse jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}