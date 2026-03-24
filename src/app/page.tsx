import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* LinkedIn Logo */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 21" className="h-8 w-auto" fill="#0a66c2">
              <g>
                <path d="M12.5 2.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM8.25 6.5H12v13H8.25V6.5zM14.75 6.5h3.6v1.77h.05c.5-.95 1.73-1.95 3.56-1.95 3.8 0 4.5 2.5 4.5 5.75V19.5H22.7v-6.62c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V19.5h-3.21V6.5z" />
                <text x="30" y="16" fontSize="16" fontWeight="700" fill="#0a66c2" fontFamily="Arial, sans-serif">LinkedIn</text>
              </g>
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-700 font-semibold">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full px-5">
                Join now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — LinkedIn style */}
      <main className="max-w-6xl mx-auto px-4 pt-12 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-light text-[#8f5849] leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Welcome to your professional community
            </h1>
            <div className="space-y-3">
              <Link href="/signup" className="block">
                <Button className="w-full sm:w-auto bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full h-12 px-8 text-base">
                  Join now
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-300 flex-1" />
                <span className="text-sm text-slate-500">or</span>
                <div className="h-px bg-slate-300 flex-1" />
              </div>
              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 font-semibold rounded-full h-12 px-8 text-base"
                >
                  Sign in
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dce6f1] to-[#b3cde0] rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { icon: '👩‍💼', label: 'Professionals' },
                      { icon: '🏢', label: 'Companies' },
                      { icon: '💼', label: 'Jobs' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs font-medium text-slate-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-bold">J</div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900">John Doe</p>
                        <p className="text-xs text-slate-500">Software Engineer at Google</p>
                      </div>
                    </div>
                    <div className="text-xs text-[#0a66c2] font-semibold">+ Connect</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 mb-4">Explore more</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Find a job', 'Find a person', 'Learn a skill', 'Post a job'].map((item) => (
              <Link
                key={item}
                href="/signup"
                className="text-sm text-slate-600 hover:text-[#0a66c2] hover:underline font-medium"
              >
                {item} →
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            {['About', 'Accessibility', 'Help Center', 'Privacy & Terms', 'Ad Choices', 'Advertising', 'Business Services', 'Get the LinkedIn app'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-500 hover:text-[#0a66c2] hover:underline">
                {item}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-1">
            <span className="text-[#0a66c2] font-bold text-sm">LinkedIn</span>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
